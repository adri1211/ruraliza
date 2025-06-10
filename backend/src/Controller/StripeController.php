<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

class StripeController extends AbstractController
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/stripe/create-checkout-session', name: 'create_checkout_session', methods: ['POST'])]
    public function createCheckoutSession(Request $request): JsonResponse
    {
        \Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

        $data = json_decode($request->getContent(), true);

        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'mode' => 'subscription',
            'line_items' => [[
                'price' => 'price_1RVBMkPfJNBJHVdcrXiPBSU6', // Copia el ID del precio de Stripe
                'quantity' => 1,
            ]],
            'success_url' => 'http://54.224.90.26/suscripcion-exitosa',
            'cancel_url' => 'http://54.224.90.26/suscripcion-cancelada',
            'customer_email' => $data['email'] ?? null,
        ]);

        return $this->json(['url' => $session->url]);
    }

    #[Route('/api/stripe/webhook', name: 'stripe_webhook', methods: ['POST'])]
    public function stripeWebhook(Request $request): Response
    {
        $payload = $request->getContent();
        $sig_header = $request->headers->get('stripe-signature');
        $endpoint_secret = $_ENV['STRIPE_WEBHOOK_SECRET'];

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch(\UnexpectedValueException $e) {
            error_log('Error de payload inválido en webhook de Stripe: ' . $e->getMessage());
            return new Response('Invalid payload', 400);
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            error_log('Error de firma inválida en webhook de Stripe: ' . $e->getMessage());
            return new Response('Invalid signature', 400);
        }

        try {
            // Cuando la suscripción se completa
            if ($event->type === 'checkout.session.completed') {
                $session = $event->data->object;
                $email = $session->customer_email;
                
                error_log('Procesando checkout.session.completed para email: ' . $email);

                $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
                
                if (!$user) {
                    error_log('Usuario no encontrado para el email: ' . $email);
                    return new Response('Usuario no encontrado', 404);
                }

                error_log('Estado actual de isSubscribed antes de actualizar: ' . ($user->isSubscribed() ? 'true' : 'false'));
                $user->setIsSubscribed(true);
                error_log('Estado de isSubscribed después de setIsSubscribed: ' . ($user->isSubscribed() ? 'true' : 'false'));
                
                try {
                    $this->entityManager->persist($user);
                    error_log('Usuario persistido correctamente');
                    $this->entityManager->flush();
                    error_log('Cambios guardados en la base de datos');
                    
                    // Verificar el estado después de guardar
                    $this->entityManager->clear(); // Limpiar el entity manager
                    $userVerificado = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
                    error_log('Estado final de isSubscribed después de guardar: ' . ($userVerificado->isSubscribed() ? 'true' : 'false'));
                } catch (\Exception $e) {
                    error_log('Error al guardar en la base de datos: ' . $e->getMessage());
                    error_log('Stack trace del error de base de datos: ' . $e->getTraceAsString());
                    throw $e;
                }
            }

            return new Response('Webhook procesado correctamente', 200);
        } catch (\Exception $e) {
            error_log('Error procesando webhook de Stripe: ' . $e->getMessage());
            error_log('Stack trace: ' . $e->getTraceAsString());
            return new Response('Error interno del servidor', 500);
        }
    }
} 
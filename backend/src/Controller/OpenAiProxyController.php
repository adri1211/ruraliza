<?php

namespace App\Controller;

use App\Entity\Space;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use GuzzleHttp\Client;

class OpenAiProxyController extends AbstractController
{
    #[Route('/api/chat-openai', name: 'chat_openai', methods: ['POST'])]
    public function chatOpenAi(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['message'])) {
            return new JsonResponse(['error' => 'Falta el mensaje.'], 400);
        }

        $userMessage = $data['message'];
        $apiKey = $_ENV['OPENAI_API_KEY'] ?? null;
        if (!$apiKey) {
            return new JsonResponse(['error' => 'No hay API KEY de OpenAI configurada.'], 500);
        }

        // Mejorar el filtrado: buscar por palabras clave (OR)
        $keywords = array_filter(explode(' ', strtolower($userMessage)));
        $qb = $em->createQueryBuilder();
        $qb->select('s')
            ->from(Space::class, 's');
        $orX = $qb->expr()->orX();
        foreach ($keywords as $i => $word) {
            $orX->add($qb->expr()->like('LOWER(s.description)', ':word' . $i));
            $qb->setParameter('word' . $i, '%' . $word . '%');
        }
        $qb->where($orX)
           ->setMaxResults(10);
        $spaces = $qb->getQuery()->getResult();

        // Preparar la lista de espacios para OpenAI
        $espacios = [];
        foreach ($spaces as $space) {
            $espacios[] = [
                'id' => $space->getId(),
                'nombre' => $space->getLocation(),
                'precio' => $space->getPrice(),
                'descripcion' => $space->getDescription(),
                'categoria' => $space->getCategory(),
            ];
        }

        // Si no hay espacios filtrados, responde directamente
        if (count($espacios) === 0) {
            return new JsonResponse([
                'response' => 'No hay espacios disponibles que coincidan con tus requisitos en este momento.',
                'spaces' => []
            ]);
        }

  

        // Construir el prompt para OpenAI (más estricto)
        $prompt = "El usuario busca un espacio con estos requisitos: '$userMessage'.\n";
        $prompt .= "Estos son los espacios disponibles en la base de datos (usa exactamente el nombre y el ID como aparecen aquí, no inventes ni modifiques nada):\n\n";
        foreach ($espacios as $i => $espacio) {
            $prompt .= ($i+1) . ". [ID: {$espacio['id']}] Nombre: {$espacio['nombre']}, Precio: {$espacio['precio']}€, Categoría: {$espacio['categoria']}, Descripción: {$espacio['descripcion']}\n";
        }
        $prompt .= "\nRecomienda al usuario solo los espacios de la lista anterior, usando exactamente el nombre y el ID entre corchetes. No inventes espacios ni IDs. Si solo hay un espacio, recomienda solo ese.";

        $client = new Client();
        $url = 'https://api.openai.com/v1/chat/completions';

        try {
            $response = $client->post($url, [
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Authorization' => 'Bearer ' . $apiKey,
                ],
                'json' => [
                    'model' => 'gpt-3.5-turbo',
                    'messages' => [
                        ['role' => 'user', 'content' => $prompt]
                    ]
                ]
            ]);
            $body = json_decode($response->getBody()->getContents(), true);
            $text = $body['choices'][0]['message']['content'] ?? '';
            // Devolver también la lista de espacios filtrados
            return new JsonResponse(['response' => $text, 'spaces' => $espacios]);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error al conectar con OpenAI: ' . $e->getMessage()], 500);
        }
    }
} 
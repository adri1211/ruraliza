<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Entity\Space;
use App\Repository\NotificationRepository;
use App\Repository\SpaceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/notifications')]
class NotificationController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private NotificationRepository $notificationRepository,
        private SpaceRepository $spaceRepository
    ) {}

    // Obtener notificaciones del usuario autenticado
    #[Route('', name: 'notification_list', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function list(): JsonResponse
    {
        $user = $this->getUser();
        $notifications = $this->notificationRepository->findBy(['recipient' => $user], ['createdAt' => 'DESC']);
        return $this->json($notifications, Response::HTTP_OK, [], ['groups' => 'notification:read']);
    }

    // Crear una notificación (por ejemplo, cuando alguien quiere alquilar un espacio)
    #[Route('', name: 'notification_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['spaceId'])) {
            return $this->json(['error' => 'Falta el ID del espacio'], Response::HTTP_BAD_REQUEST);
        }
        $space = $this->spaceRepository->find($data['spaceId']);
        if (!$space) {
            return $this->json(['error' => 'Espacio no encontrado'], Response::HTTP_NOT_FOUND);
        }
        $recipient = $space->getOwner();
        $sender = $this->getUser();
        if ($recipient === $sender) {
            return $this->json(['error' => 'No puedes alquilar tu propio espacio'], Response::HTTP_BAD_REQUEST);
        }
        $notification = new Notification();
        $notification->setRecipient($recipient);
        $notification->setSpace($space);
        $notification->setMessage('El usuario ' . $sender->getUsername() . ' quiere alquilar tu espacio "' . $space->getLocation() . '".');
        $this->entityManager->persist($notification);
        $this->entityManager->flush();
        return $this->json($notification, Response::HTTP_CREATED, [], ['groups' => 'notification:read']);
    }

    // Marcar notificación como leída
    #[Route('/{id}/read', name: 'notification_mark_read', methods: ['PATCH'])]
    #[IsGranted('ROLE_USER')]
    public function markRead(Notification $notification): JsonResponse
    {
        $user = $this->getUser();
        if ($notification->getRecipient() !== $user) {
            return $this->json(['error' => 'No tienes permiso para modificar esta notificación'], Response::HTTP_FORBIDDEN);
        }
        $notification->setIsRead(true);
        $this->entityManager->flush();
        return $this->json(['success' => true]);
    }
} 
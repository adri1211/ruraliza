<?php

namespace App\Controller;

use App\Entity\Chat;
use App\Entity\Message;
use App\Entity\Space;
use App\Repository\ChatRepository;
use App\Repository\MessageRepository;
use App\Repository\SpaceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/chats')]
#[IsGranted('ROLE_USER')]
class ChatController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private ChatRepository $chatRepository,
        private MessageRepository $messageRepository,
        private SpaceRepository $spaceRepository
    ) {}

    #[Route('', name: 'chat_list', methods: ['GET'])]
    public function list(): JsonResponse
    {
        $user = $this->getUser();
        $chats = $this->chatRepository->findChatsByUser($user->getId());
        return $this->json($chats, Response::HTTP_OK, [], ['groups' => 'chat:read']);
    }

    #[Route('/{id}', name: 'chat_show', methods: ['GET'])]
    public function show(Chat $chat): JsonResponse
    {
        $user = $this->getUser();
        if ($chat->getOwner() !== $user && $chat->getRenter() !== $user) {
            return $this->json(['error' => 'No tienes permiso para ver este chat'], Response::HTTP_FORBIDDEN);
        }

        // Marcar mensajes como leídos
        $this->messageRepository->markMessagesAsRead($chat->getId(), $user->getId());

        $messages = $this->messageRepository->findMessagesByChat($chat->getId());
        return $this->json([
            'chat' => $chat,
            'messages' => $messages
        ], Response::HTTP_OK, [], ['groups' => ['chat:read', 'message:read']]);
    }

    #[Route('', name: 'chat_create', methods: ['POST'])]
    public function create(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        if (!isset($data['spaceId']) || !isset($data['renterId'])) {
            return $this->json(['error' => 'Faltan datos requeridos'], Response::HTTP_BAD_REQUEST);
        }

        $space = $this->spaceRepository->find($data['spaceId']);
        if (!$space) {
            return $this->json(['error' => 'Espacio no encontrado'], Response::HTTP_NOT_FOUND);
        }

        $user = $this->getUser();
        $renter = $this->entityManager->getReference('App\Entity\User', $data['renterId']);

        // Verificar que el usuario actual es el propietario o el inquilino
        if ($space->getOwner() !== $user && $user->getId() !== $data['renterId']) {
            return $this->json(['error' => 'No tienes permiso para crear este chat'], Response::HTTP_FORBIDDEN);
        }

        // Determinar quién es el propietario y quién el inquilino
        $owner = $space->getOwner();
        $renter = $owner->getId() === $user->getId() ? 
            $this->entityManager->getReference('App\Entity\User', $data['renterId']) : 
            $user;

        // Verificar si ya existe un chat entre estos usuarios para este espacio
        $existingChat = $this->chatRepository->findChatByUsersAndSpace(
            $owner->getId(),
            $renter->getId(),
            $space->getId()
        );

        if ($existingChat) {
            return $this->json($existingChat, Response::HTTP_OK, [], ['groups' => 'chat:read']);
        }

        $chat = new Chat();
        $chat->setOwner($owner);
        $chat->setSpace($space);
        $chat->setRenter($renter);

        $this->entityManager->persist($chat);
        $this->entityManager->flush();

        return $this->json($chat, Response::HTTP_CREATED, [], ['groups' => 'chat:read']);
    }

    #[Route('/{id}/messages', name: 'chat_send_message', methods: ['POST'])]
    public function sendMessage(Request $request, Chat $chat): JsonResponse
    {
        $user = $this->getUser();
        if ($chat->getOwner() !== $user && $chat->getRenter() !== $user) {
            return $this->json(['error' => 'No tienes permiso para enviar mensajes en este chat'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['content'])) {
            return $this->json(['error' => 'El contenido del mensaje es requerido'], Response::HTTP_BAD_REQUEST);
        }

        $message = new Message();
        $message->setChat($chat);
        $message->setSender($user);
        $message->setContent($data['content']);

        $this->entityManager->persist($message);
        $this->entityManager->flush();

        // Aquí podrías implementar la lógica para enviar el mensaje a través de WebSocket
        // Por ahora solo devolvemos el mensaje creado

        return $this->json($message, Response::HTTP_CREATED, [], ['groups' => 'message:read']);
    }

    #[Route('/{id}/unread', name: 'chat_unread_count', methods: ['GET'])]
    public function unreadCount(Chat $chat): JsonResponse
    {
        $user = $this->getUser();
        if ($chat->getOwner() !== $user && $chat->getRenter() !== $user) {
            return $this->json(['error' => 'No tienes permiso para ver este chat'], Response::HTTP_FORBIDDEN);
        }

        $count = $this->messageRepository->countUnreadMessages($chat->getId(), $user->getId());
        return $this->json(['unreadCount' => $count]);
    }

    #[Route('/{id}/typing', name: 'chat_typing', methods: ['POST'])]
    public function typing(Request $request, Chat $chat): JsonResponse
    {
        $user = $this->getUser();
        if ($chat->getOwner() !== $user && $chat->getRenter() !== $user) {
            return $this->json(['error' => 'No tienes permiso para este chat'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['isTyping'])) {
            return $this->json(['error' => 'Falta el estado de escritura'], Response::HTTP_BAD_REQUEST);
        }

        //simplemente devolvemos el estado
        return $this->json([
            'userId' => $user->getId(),
            'username' => $user->getUsername(),
            'isTyping' => $data['isTyping']
        ]);
    }
} 
<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Space;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    #[Route('/users', name: 'admin_users', methods: ['GET'])]
    public function getUsers(EntityManagerInterface $entityManager): JsonResponse
    {
        $users = $entityManager->getRepository(User::class)->findAll();
        $userData = array_map(function (User $user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'username' => $user->getUsername(),
                'fullName' => $user->getFullName(),
                'roles' => $user->getRoles(),
                'createdAt' => $user->getBirthdate()->format('Y-m-d'),
            ];
        }, $users);

        return $this->json($userData);
    }

    #[Route('/spaces', name: 'admin_spaces', methods: ['GET'])]
    public function getSpaces(EntityManagerInterface $entityManager): JsonResponse
    {
        $spaces = $entityManager->getRepository(Space::class)->findAll();
        $spaceData = array_map(function (Space $space) {
            return [
                'id' => $space->getId(),
                'location' => $space->getLocation(),
                'price' => $space->getPrice(),
                'category' => $space->getCategory(),
                'description' => $space->getDescription(),
                'owner' => [
                    'id' => $space->getOwner()->getId(),
                    'username' => $space->getOwner()->getUsername(),
                    'email' => $space->getOwner()->getEmail(),
                ],
                'createdAt' => $space->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }, $spaces);

        return $this->json($spaceData);
    }

    #[Route('/users/{id}', name: 'admin_update_user', methods: ['PUT'])]
    public function updateUser(Request $request, User $user, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['roles'])) {
            $user->setRoles($data['roles']);
        }
        
        if (isset($data['email'])) {
            $user->setEmail($data['email']);
        }
        
        if (isset($data['username'])) {
            $user->setUsername($data['username']);
        }
        
        if (isset($data['fullName'])) {
            $user->setFullName($data['fullName']);
        }

        $entityManager->flush();

        return $this->json(['message' => 'Usuario actualizado correctamente']);
    }

    #[Route('/spaces/{id}', name: 'admin_update_space', methods: ['PUT'])]
    public function updateSpace(Request $request, Space $space, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['location'])) {
            $space->setLocation($data['location']);
        }
        
        if (isset($data['price'])) {
            $space->setPrice($data['price']);
        }
        
        if (isset($data['category'])) {
            $space->setCategory($data['category']);
        }
        
        if (isset($data['description'])) {
            $space->setDescription($data['description']);
        }

        $space->setUpdatedAt(new \DateTimeImmutable());
        $entityManager->flush();

        return $this->json(['message' => 'Espacio actualizado correctamente']);
    }

    #[Route('/users/{id}', name: 'admin_delete_user', methods: ['DELETE'])]
    public function deleteUser(User $user, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($user);
        $entityManager->flush();

        return $this->json(['message' => 'Usuario eliminado correctamente']);
    }

    #[Route('/spaces/{id}', name: 'admin_delete_space', methods: ['DELETE'])]
    public function deleteSpace(Space $space, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($space);
        $entityManager->flush();

        return $this->json(['message' => 'Espacio eliminado correctamente']);
    }
} 
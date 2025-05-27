<?php

namespace App\Controller;

use App\Entity\Favorite;
use App\Entity\Space;
use App\Repository\FavoriteRepository;
use App\Repository\SpaceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/favorites')]
class FavoriteController extends AbstractController
{
    #[Route('', name: 'favorites_list', methods: ['GET'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function list(FavoriteRepository $favoriteRepository): JsonResponse
    {
        $user = $this->getUser();
        $favorites = $favoriteRepository->findBy(['user' => $user]);
        $spaces = array_map(fn($fav) => $fav->getSpace(), $favorites);

        // Puedes usar normalización o serialización según tu configuración
        return $this->json($spaces, 200, [], ['groups' => ['space:read']]);
    }

    #[Route('/{spaceId}', name: 'favorite_add', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function add(
        int $spaceId,
        SpaceRepository $spaceRepository,
        FavoriteRepository $favoriteRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();
        $space = $spaceRepository->find($spaceId);

        if (!$space) {
            return $this->json(['error' => 'Espacio no encontrado'], 404);
        }

        // Evitar duplicados
        $existing = $favoriteRepository->findOneBy(['user' => $user, 'space' => $space]);
        if ($existing) {
            return $this->json(['error' => 'Ya está en favoritos'], 409);
        }

        $favorite = new Favorite();
        $favorite->setUser($user);
        $favorite->setSpace($space);

        $em->persist($favorite);
        $em->flush();

        return $this->json(['success' => true], 201);
    }

    #[Route('/{spaceId}', name: 'favorite_remove', methods: ['DELETE'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function remove(
        int $spaceId,
        SpaceRepository $spaceRepository,
        FavoriteRepository $favoriteRepository,
        EntityManagerInterface $em
    ): JsonResponse {
        $user = $this->getUser();
        $space = $spaceRepository->find($spaceId);

        if (!$space) {
            return $this->json(['error' => 'Espacio no encontrado'], 404);
        }

        $favorite = $favoriteRepository->findOneBy(['user' => $user, 'space' => $space]);
        if (!$favorite) {
            return $this->json(['error' => 'No está en favoritos'], 404);
        }

        $em->remove($favorite);
        $em->flush();

        return $this->json(['success' => true]);
    }
}

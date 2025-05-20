<?php

namespace App\Controller;

use App\Entity\Space;
use App\Repository\SpaceRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/spaces')]
class SpaceController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private SpaceRepository $spaceRepository
    ) {}

    #[Route('', name: 'app_space_index', methods: ['GET'])]
    public function index(): JsonResponse
    {
        $spaces = $this->spaceRepository->findAll();
        return $this->json($spaces, Response::HTTP_OK, [], ['groups' => 'space:read']);
    }

    #[Route('', name: 'app_space_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(Request $request): JsonResponse
    {
        try {
            $space = new Space();
            $space->setLocation($request->request->get('location'));
            $space->setPrice((float)$request->request->get('price'));
            $space->setDescription($request->request->get('description'));
            $space->setCategory($request->request->get('category'));
            $space->setOwner($this->getUser());
            
            // Manejar las imágenes
            if ($request->files->has('images')) {
                $uploadedFiles = $request->files->get('images');
                $images = [];
                
                foreach ($uploadedFiles as $file) {
                    $fileName = md5(uniqid()) . '.' . $file->guessExtension();
                    
                    try {
                        $file->move(
                            $this->getParameter('spaces_directory'),
                            $fileName
                        );
                        $images[] = $fileName;
                    } catch (\Exception $e) {
                        return $this->json([
                            'error' => 'Error al subir la imagen: ' . $e->getMessage()
                        ], Response::HTTP_INTERNAL_SERVER_ERROR);
                    }
                }
                
                $space->setImages($images);
            }

            $this->entityManager->persist($space);
            $this->entityManager->flush();

            return $this->json($space, Response::HTTP_CREATED, [], ['groups' => 'space:read']);
            
        } catch (\Exception $e) {
            return $this->json([
                'error' => 'Error al crear el espacio: ' . $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/{id}', name: 'app_space_show', methods: ['GET'])]
    public function show(Space $space): JsonResponse
    {
        return $this->json($space, Response::HTTP_OK, [], ['groups' => 'space:read']);
    }

    #[Route('/{id}', name: 'app_space_update', methods: ['PUT'])]
    #[IsGranted('ROLE_USER')]
    public function update(Request $request, Space $space): JsonResponse
    {
        if ($space->getOwner() !== $this->getUser()) {
            return $this->json(['message' => 'No tienes permiso para editar este espacio'], Response::HTTP_FORBIDDEN);
        }

        $data = json_decode($request->getContent(), true);
        
        if (isset($data['location'])) {
            $space->setLocation($data['location']);
        }
        if (isset($data['price'])) {
            $space->setPrice((float)$data['price']);
        }
        if (isset($data['description'])) {
            $space->setDescription($data['description']);
        }
        if (isset($data['category'])) {
            $space->setCategory($data['category']);
        }

        $this->entityManager->flush();

        return $this->json($space, Response::HTTP_OK, [], ['groups' => 'space:read']);
    }

    #[Route('/{id}', name: 'app_space_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(Space $space): JsonResponse
    {
        if ($space->getOwner() !== $this->getUser()) {
            return $this->json(['message' => 'No tienes permiso para eliminar este espacio'], Response::HTTP_FORBIDDEN);
        }

        // Eliminar imágenes físicas si existen
        foreach ($space->getImages() as $image) {
            $imagePath = $this->getParameter('spaces_directory') . '/' . $image;
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        $this->entityManager->remove($space);
        $this->entityManager->flush();

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/user/spaces', name: 'app_user_spaces', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function userSpaces(): JsonResponse
    {
        $spaces = $this->spaceRepository->findBy(['owner' => $this->getUser()]);
        return $this->json($spaces, Response::HTTP_OK, [], ['groups' => 'space:read']);
    }
} 
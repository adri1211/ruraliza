<?php

namespace App\Entity;

use App\Repository\SpaceRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: SpaceRepository::class)]
class Space
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['space:read', 'notification:read', 'chat:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['space:read', 'space:write', 'chat:read'])]
    private ?string $location = null;

    #[ORM\Column]
    #[Groups(['space:read', 'space:write', 'chat:read'])]
    private ?float $price = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['space:read', 'space:write', 'chat:read'])]
    private ?string $description = null;

    #[ORM\Column(length: 50)]
    #[Groups(['space:read', 'space:write', 'chat:read'])]
    private ?string $category = null;

    #[ORM\Column(type: 'json', nullable: true)]
    #[Groups(['space:read', 'space:write', 'chat:read'])]
    private array $images = [];

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'spaces')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['space:read', 'chat:read'])]
    private ?User $owner = null;

    #[ORM\Column]
    #[Groups(['space:read', 'chat:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    #[Groups(['space:read', 'chat:read'])]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\OneToMany(mappedBy: 'space', targetEntity: Favorite::class, orphanRemoval: true)]
    private Collection $favorites;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->updatedAt = new \DateTimeImmutable();
        $this->favorites = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;
        return $this;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
    {
        $this->category = $category;
        return $this;
    }

    public function getImages(): array
    {
        return $this->images;
    }

    public function setImages(?array $images): static
    {
        $this->images = $images ?? [];
        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }

    public function getFavorites(): Collection
    {
        return $this->favorites;
    }
} 
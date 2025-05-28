<?php

namespace App\Repository;

use App\Entity\Chat;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ChatRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Chat::class);
    }

    public function findChatsByUser(int $userId): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.owner = :userId OR c.renter = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('c.updatedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findChatByUsersAndSpace(int $ownerId, int $renterId, int $spaceId): ?Chat
    {
        return $this->createQueryBuilder('c')
            ->where('c.owner = :ownerId AND c.renter = :renterId AND c.space = :spaceId')
            ->setParameter('ownerId', $ownerId)
            ->setParameter('renterId', $renterId)
            ->setParameter('spaceId', $spaceId)
            ->getQuery()
            ->getOneOrNullResult();
    }
} 
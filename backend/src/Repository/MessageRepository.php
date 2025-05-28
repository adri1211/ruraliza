<?php

namespace App\Repository;

use App\Entity\Message;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    public function findMessagesByChat(int $chatId): array
    {
        return $this->createQueryBuilder('m')
            ->where('m.chat = :chatId')
            ->setParameter('chatId', $chatId)
            ->orderBy('m.createdAt', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function markMessagesAsRead(int $chatId, int $userId): void
    {
        $this->createQueryBuilder('m')
            ->update()
            ->set('m.isRead', true)
            ->where('m.chat = :chatId')
            ->andWhere('m.sender != :userId')
            ->setParameter('chatId', $chatId)
            ->setParameter('userId', $userId)
            ->getQuery()
            ->execute();
    }

    public function countUnreadMessages(int $chatId, int $userId): int
    {
        return $this->createQueryBuilder('m')
            ->select('COUNT(m.id)')
            ->where('m.chat = :chatId')
            ->andWhere('m.sender != :userId')
            ->andWhere('m.isRead = false')
            ->setParameter('chatId', $chatId)
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getSingleScalarResult();
    }
} 
<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:create-test-user',
    description: 'Crea usuarios de prueba para desarrollo'
)]
class CreateTestUserCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Crear primer usuario
        $user1 = new User();
        $user1->setEmail('test1@example.com');
        $user1->setUsername('testuser1');
        $user1->setFullName('Usuario de Prueba 1');
        $user1->setPhone(123456789);
        $user1->setBirthdate(new \DateTime('1990-01-01'));
        $user1->setRoles(['ROLE_USER']);

        $hashedPassword = $this->passwordHasher->hashPassword(
            $user1,
            'password123'
        );
        $user1->setPassword($hashedPassword);

        // Crear segundo usuario
        $user2 = new User();
        $user2->setEmail('test2@example.com');
        $user2->setUsername('testuser2');
        $user2->setFullName('Usuario de Prueba 2');
        $user2->setPhone(987654321);
        $user2->setBirthdate(new \DateTime('1991-02-02'));
        $user2->setRoles(['ROLE_USER']);

        $hashedPassword2 = $this->passwordHasher->hashPassword(
            $user2,
            'password123'
        );
        $user2->setPassword($hashedPassword2);

        $this->entityManager->persist($user1);
        $this->entityManager->persist($user2);
        $this->entityManager->flush();

        $output->writeln('Usuarios de prueba creados exitosamente:');
        $output->writeln('');
        $output->writeln('Usuario 1:');
        $output->writeln('Email: test1@example.com');
        $output->writeln('Contraseña: password123');
        $output->writeln('');
        $output->writeln('Usuario 2:');
        $output->writeln('Email: test2@example.com');
        $output->writeln('Contraseña: password123');

        return Command::SUCCESS;
    }
} 
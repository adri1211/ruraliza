<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:assign-admin-role',
    description: 'Asigna el rol de administrador a un usuario existente',
)]
class AssignAdminRoleCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('email', InputArgument::REQUIRED, 'Email del usuario')
            ->setHelp('Este comando permite asignar el rol ROLE_ADMIN a un usuario existente.');
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $email = $input->getArgument('email');

        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            $io->error('No se encontró ningún usuario con ese email.');
            return Command::FAILURE;
        }

        $roles = $user->getRoles();
        if (in_array('ROLE_ADMIN', $roles)) {
            $io->warning('El usuario ya tiene el rol de administrador.');
            return Command::SUCCESS;
        }

        $roles[] = 'ROLE_ADMIN';
        $user->setRoles($roles);
        $this->entityManager->flush();

        $io->success(sprintf('Se ha asignado el rol de administrador al usuario %s.', $email));

        return Command::SUCCESS;
    }
} 
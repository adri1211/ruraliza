-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-06-2025 a las 11:41:31
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rental_app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `chat`
--

CREATE TABLE `chat` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `renter_id` int(11) NOT NULL,
  `space_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `chat`
--

INSERT INTO `chat` (`id`, `owner_id`, `renter_id`, `space_id`, `created_at`, `updated_at`) VALUES
(1, 3, 1, 2, '2025-06-02 15:45:11', '2025-06-02 15:45:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `doctrine_migration_versions`
--

CREATE TABLE `doctrine_migration_versions` (
  `version` varchar(191) NOT NULL,
  `executed_at` datetime DEFAULT NULL,
  `execution_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Volcado de datos para la tabla `doctrine_migration_versions`
--

INSERT INTO `doctrine_migration_versions` (`version`, `executed_at`, `execution_time`) VALUES
('DoctrineMigrations\\Version20250601135251', '2025-06-01 15:54:55', 790);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `favorite`
--

CREATE TABLE `favorite` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `space_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `favorite`
--

INSERT INTO `favorite` (`id`, `user_id`, `space_id`, `created_at`) VALUES
(3, 1, 2, '2025-06-03 11:27:28'),
(4, 1, 3, '2025-06-03 11:27:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `chat_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `is_read` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `message`
--

INSERT INTO `message` (`id`, `chat_id`, `sender_id`, `content`, `created_at`, `is_read`) VALUES
(1, 1, 3, 'hola', '2025-06-02 15:48:58', 1),
(2, 1, 1, 'adios', '2025-06-02 15:49:24', 0),
(3, 1, 1, 'hola, estoy interesado', '2025-06-03 11:17:55', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `messenger_messages`
--

CREATE TABLE `messenger_messages` (
  `id` bigint(20) NOT NULL,
  `body` longtext NOT NULL,
  `headers` longtext NOT NULL,
  `queue_name` varchar(190) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `available_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `delivered_at` datetime DEFAULT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notification`
--

CREATE TABLE `notification` (
  `id` int(11) NOT NULL,
  `recipient_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `space_id` int(11) DEFAULT NULL,
  `message` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `is_read` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `notification`
--

INSERT INTO `notification` (`id`, `recipient_id`, `sender_id`, `space_id`, `message`, `created_at`, `is_read`) VALUES
(1, 3, 1, 2, 'El usuario adri quiere alquilar tu espacio \"Calle pilarejo número 28, Montejícar\".', '2025-06-02 15:44:50', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `space`
--

CREATE TABLE `space` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `location` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `description` longtext NOT NULL,
  `category` varchar(50) NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `created_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)',
  `updated_at` datetime NOT NULL COMMENT '(DC2Type:datetime_immutable)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `space`
--

INSERT INTO `space` (`id`, `owner_id`, `location`, `price`, `description`, `category`, `images`, `created_at`, `updated_at`) VALUES
(2, 3, 'Calle pilarejo número 28, Montejícar', 0, 'La descripción es la propia que se puede ver en los planos ahí tiene descrita los distintos espacios, estancias, superficies y uso de las dos plantas tanto la planta baja como la planta semisótano.\r\nCon respecto a este edificio el Ayuntamiento solamente dispone del edificio. El edificio en cuestión está totalmente equipado con el amueblamiento que está viendo en los planos\r\nLa forma de gestionarlo sería privada en la que el Ayuntamiento al emprendedor le haría una concesión administrativa por el período que fuese necesario o que establezcan entre las partes mutuo acuerdo el Ayuntamiento con la empresa lo años de gestión que que acuerden y con el canon anual que sea viable tanto para la emprendedor que lo obtiene como el Ayuntamiento que aporta, lo más importante es que todo el edificio, todo el amueblamiento y todo lo que dispone es un capital considerable.\r\nA partir de la información queda que una empresa o emprendedor se ponga en contacto con el Ayuntamiento de Montejícar empiecen a negociar y firme un acuerdo.', 'Otros', '[\"a07fdc11546b6bcc886fdfcb5367ca22.pdf\",\"74d72f9d9562a3be23318d73c0d5373f.pdf\"]', '2025-06-02 14:08:41', '2025-06-02 14:08:41'),
(3, 4, 'Calle Cuartel, Guadahortuna', 0, 'La Guardería esta ejecutada casi al 100%  y coincide con los planos enviados (son tres aulas de infantil)\r\n\r\nA esa guardería le hace falta algo de instalaciones como es reajustar la instalación eléctrica y climatización lo demás esta ejecutado.\r\n\r\nEl presupuesto que se estima para la terminación puede estar entorno a 15 mil o 20 mil euros\r\n\r\nLa intención del ayuntamiento es buscar a un promotor empresario para adjudicarle el uso y la gestión de la guardería durante el tiempo suficiente para que pueda tener una rentabilidad a la empresa haciendo esa inversión para terminarla y contratar los años suficiente para que mínimo pueda  amortizar esa cantidad y como empresa tenga el beneficio que corresponde\r\n\r\npara hacer viable la guardería es conveniente concertar las plazas con la junta de Andalucía de manera que habiendo una subvención por cada niño que halla en la guardería la junta aporta un dinero que es suficiente para hacerla viable porque a nivel privado exclusivamente por el perfil de la población del municipio pueda que no ocupe el 100 % de las plazas\r\n\r\ncontratar con el ayuntamiento  tanto la terminación de la guardería como la los años de gestión con el canon que corresponda', 'Otros', '[\"b8dc7fa6473e86835b3747f3183cebe0.pdf\",\"9f50eb8bcb23e8b182873af13dd71d54.pdf\",\"2bf5743d48b82ff57e1ca2fbf86a2537.pdf\"]', '2025-06-02 15:54:59', '2025-06-02 15:54:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(180) NOT NULL,
  `email` varchar(180) NOT NULL,
  `roles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`roles`)),
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `phone` int(11) NOT NULL,
  `birthdate` date NOT NULL,
  `is_subscribed` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `user`
--

INSERT INTO `user` (`id`, `username`, `email`, `roles`, `password`, `full_name`, `phone`, `birthdate`, `is_subscribed`) VALUES
(1, 'adri', 'adrian.ariza1211@gmail.com', '[\"ROLE_USER\"]', '$2y$13$2dTOMDkhkBrjYRVNgrhusuQasG/q//ojScC0urY1TBgkk3CKN7ZYu', 'Adrián Ariza', 655449676, '2005-11-12', 1),
(2, 'prueba', 'prueba@gmail.com', '[\"ROLE_USER\"]', '$2y$13$Mja/KbA/IBjNnJpO7Xi8D.73Jo75hkUT06vKQkJXRlJFnWkrz7eKm', 'prueba', 655449676, '2025-06-01', 1),
(3, 'Montejicar', 'montejicar@ayuntamiento.com', '[\"ROLE_USER\"]', '$2y$13$wWN.RXeXyOubL8nx8O4CwO29IlAsdjsYPtZB8dmHs2MmFyktjwym.', 'Francisco Javier Jiménez Árbol', 655449676, '2005-11-12', 0),
(4, 'GUADAHORTUNA', 'GUADAHORTUNA@gmail.com', '[\"ROLE_USER\"]', '$2y$13$EqIU9AZmgIeOOaiBt7KOuuLYfXpWF3YYifXzKR8u8NA.kXWEui0c.', 'Maximiliano García Navarro', 655449676, '2025-06-02', 1),
(5, 'admin', 'admin@gmail.com', '[\"ROLE_USER\",\"ROLE_ADMIN\"]', '$2y$13$zSc.wKx6Ekk/zm7d6W7sRuf8A/YifEd4.Olx9R2isx/T9ZN/kqzES', 'admin', 655449676, '2025-06-02', 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `chat`
--
ALTER TABLE `chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_659DF2AA7E3C61F9` (`owner_id`),
  ADD KEY `IDX_659DF2AAE289A545` (`renter_id`),
  ADD KEY `IDX_659DF2AA23575340` (`space_id`);

--
-- Indices de la tabla `doctrine_migration_versions`
--
ALTER TABLE `doctrine_migration_versions`
  ADD PRIMARY KEY (`version`);

--
-- Indices de la tabla `favorite`
--
ALTER TABLE `favorite`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_68C58ED9A76ED395` (`user_id`),
  ADD KEY `IDX_68C58ED923575340` (`space_id`);

--
-- Indices de la tabla `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_B6BD307F1A9A7125` (`chat_id`),
  ADD KEY `IDX_B6BD307FF624B39D` (`sender_id`);

--
-- Indices de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_75EA56E0FB7336F0` (`queue_name`),
  ADD KEY `IDX_75EA56E0E3BD61CE` (`available_at`),
  ADD KEY `IDX_75EA56E016BA31DB` (`delivered_at`);

--
-- Indices de la tabla `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_BF5476CAE92F8F78` (`recipient_id`),
  ADD KEY `IDX_BF5476CAF624B39D` (`sender_id`),
  ADD KEY `IDX_BF5476CA23575340` (`space_id`);

--
-- Indices de la tabla `space`
--
ALTER TABLE `space`
  ADD PRIMARY KEY (`id`),
  ADD KEY `IDX_2972C13A7E3C61F9` (`owner_id`);

--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UNIQ_IDENTIFIER_EMAIL` (`email`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `chat`
--
ALTER TABLE `chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `favorite`
--
ALTER TABLE `favorite`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `messenger_messages`
--
ALTER TABLE `messenger_messages`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `notification`
--
ALTER TABLE `notification`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `space`
--
ALTER TABLE `space`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `chat`
--
ALTER TABLE `chat`
  ADD CONSTRAINT `FK_659DF2AA23575340` FOREIGN KEY (`space_id`) REFERENCES `space` (`id`),
  ADD CONSTRAINT `FK_659DF2AA7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_659DF2AAE289A545` FOREIGN KEY (`renter_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `favorite`
--
ALTER TABLE `favorite`
  ADD CONSTRAINT `FK_68C58ED923575340` FOREIGN KEY (`space_id`) REFERENCES `space` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_68C58ED9A76ED395` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `FK_B6BD307F1A9A7125` FOREIGN KEY (`chat_id`) REFERENCES `chat` (`id`),
  ADD CONSTRAINT `FK_B6BD307FF624B39D` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `FK_BF5476CA23575340` FOREIGN KEY (`space_id`) REFERENCES `space` (`id`),
  ADD CONSTRAINT `FK_BF5476CAE92F8F78` FOREIGN KEY (`recipient_id`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `FK_BF5476CAF624B39D` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`);

--
-- Filtros para la tabla `space`
--
ALTER TABLE `space`
  ADD CONSTRAINT `FK_2972C13A7E3C61F9` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

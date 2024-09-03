-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-09-2024 a las 05:42:11
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
-- Base de datos: `app`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria_salon`
--

CREATE TABLE `categoria_salon` (
  `id` int(11) NOT NULL,
  `categoria` enum('salon','laboratorio','aulario') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria_salon`
--

INSERT INTO `categoria_salon` (`id`, `categoria`) VALUES
(1, 'salon'),
(2, 'laboratorio'),
(3, 'aulario');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clase`
--

CREATE TABLE `clase` (
  `id` int(11) NOT NULL,
  `horario` int(11) DEFAULT NULL,
  `salon` int(11) DEFAULT NULL,
  `supervisor` int(11) DEFAULT NULL,
  `estado` enum('completada','perdida','pendiente') NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clase`
--

INSERT INTO `clase` (`id`, `horario`, `salon`, `supervisor`, `estado`, `fecha`) VALUES
(145, 129, 3, 1, 'pendiente', '2024-08-19'),
(146, 129, 3, 1, 'pendiente', '2024-08-26'),
(147, 129, 3, 1, 'pendiente', '2024-09-02'),
(148, 129, 3, 1, 'pendiente', '2024-09-09'),
(149, 129, 3, 1, 'pendiente', '2024-09-16'),
(150, 129, 3, 1, 'pendiente', '2024-09-23'),
(151, 129, 3, 1, 'pendiente', '2024-09-30'),
(152, 129, 3, 1, 'pendiente', '2024-10-07'),
(153, 129, 3, 1, 'pendiente', '2024-10-21'),
(154, 129, 3, 1, 'pendiente', '2024-10-14'),
(155, 129, 3, 1, 'pendiente', '2024-11-04'),
(156, 129, 3, 1, 'pendiente', '2024-10-28'),
(157, 129, 3, 1, 'pendiente', '2024-11-11'),
(158, 129, 3, 1, 'pendiente', '2024-12-02'),
(159, 129, 3, 1, 'pendiente', '2024-11-18'),
(160, 129, 3, 1, 'pendiente', '2024-11-25'),
(161, 129, 3, 1, 'pendiente', '2024-12-09'),
(162, 129, 3, 1, 'pendiente', '2024-12-16'),
(163, 129, 3, 1, 'pendiente', '2024-12-23'),
(164, 129, 3, 1, 'pendiente', '2024-12-30'),
(165, 129, 3, 1, 'pendiente', '2025-01-06'),
(166, 129, 3, 1, 'pendiente', '2025-01-13'),
(167, 129, 3, 1, 'pendiente', '2025-01-20'),
(168, 129, 3, 1, 'pendiente', '2025-02-10'),
(169, 129, 3, 1, 'pendiente', '2025-02-03'),
(170, 129, 3, 1, 'pendiente', '2025-01-27'),
(171, 131, 2, 1, 'pendiente', '2024-08-20'),
(172, 131, 2, 1, 'pendiente', '2024-08-27'),
(173, 131, 2, 1, 'pendiente', '2024-09-03'),
(174, 131, 2, 1, 'pendiente', '2024-09-10'),
(175, 131, 2, 1, 'pendiente', '2024-09-17'),
(176, 131, 2, 1, 'pendiente', '2024-10-01'),
(177, 131, 2, 1, 'pendiente', '2024-09-24'),
(178, 131, 2, 1, 'pendiente', '2024-10-08'),
(179, 131, 2, 1, 'pendiente', '2024-10-15'),
(180, 131, 2, 1, 'pendiente', '2024-10-22'),
(181, 131, 2, 1, 'pendiente', '2024-10-29'),
(182, 131, 2, 1, 'pendiente', '2024-11-05'),
(183, 131, 2, 1, 'pendiente', '2024-11-12'),
(184, 131, 2, 1, 'pendiente', '2024-11-19'),
(185, 131, 2, 1, 'pendiente', '2024-11-26'),
(186, 131, 2, 1, 'pendiente', '2024-12-03'),
(187, 131, 2, 1, 'pendiente', '2024-12-10'),
(188, 131, 2, 1, 'pendiente', '2024-12-17'),
(189, 131, 2, 1, 'pendiente', '2024-12-24'),
(190, 131, 2, 1, 'pendiente', '2025-01-07'),
(191, 131, 2, 1, 'pendiente', '2024-12-31'),
(192, 131, 2, 1, 'pendiente', '2025-01-14'),
(193, 131, 2, 1, 'pendiente', '2025-01-21'),
(194, 131, 2, 1, 'pendiente', '2025-01-28'),
(195, 131, 2, 1, 'pendiente', '2025-02-04'),
(196, 131, 2, 1, 'pendiente', '2025-02-11'),
(197, 132, 3, 1, 'pendiente', '2024-08-27'),
(198, 132, 3, 4, 'pendiente', '2024-08-20'),
(199, 132, 3, 3, 'pendiente', '2024-09-03'),
(200, 132, 3, 3, 'pendiente', '2024-09-10'),
(201, 132, 3, 1, 'pendiente', '2024-09-17'),
(202, 132, 3, 3, 'pendiente', '2024-09-24'),
(203, 132, 3, 4, 'pendiente', '2024-10-01'),
(204, 132, 3, 3, 'pendiente', '2024-10-15'),
(205, 132, 3, 3, 'pendiente', '2024-10-29'),
(206, 132, 3, 3, 'pendiente', '2024-10-08'),
(207, 132, 3, 1, 'pendiente', '2024-10-22'),
(208, 132, 3, 4, 'pendiente', '2024-11-05'),
(209, 132, 3, 4, 'pendiente', '2024-11-12'),
(210, 132, 3, 4, 'pendiente', '2024-11-19'),
(211, 132, 3, 4, 'pendiente', '2024-11-26'),
(212, 132, 3, 1, 'pendiente', '2024-12-03'),
(213, 132, 3, 3, 'pendiente', '2024-12-17'),
(214, 132, 3, 3, 'pendiente', '2024-12-10'),
(215, 132, 3, 3, 'pendiente', '2024-12-24'),
(216, 132, 3, 4, 'pendiente', '2025-01-07'),
(217, 132, 3, 3, 'pendiente', '2024-12-31'),
(218, 132, 3, 3, 'pendiente', '2025-01-14'),
(219, 132, 3, 3, 'pendiente', '2025-01-21'),
(220, 132, 3, 4, 'pendiente', '2025-02-04'),
(221, 132, 3, 4, 'pendiente', '2025-01-28'),
(222, 132, 3, 1, 'pendiente', '2025-02-11'),
(223, 133, 1, 4, 'pendiente', '2024-08-20'),
(224, 133, 1, 1, 'pendiente', '2024-08-27'),
(225, 133, 1, 4, 'pendiente', '2024-09-03'),
(226, 133, 1, 4, 'pendiente', '2024-09-10'),
(227, 133, 1, 1, 'pendiente', '2024-09-17'),
(228, 133, 1, 1, 'pendiente', '2024-09-24'),
(229, 133, 1, 1, 'pendiente', '2024-10-15'),
(230, 133, 1, 3, 'pendiente', '2024-10-01'),
(231, 133, 1, 4, 'pendiente', '2024-10-08'),
(232, 133, 1, 4, 'pendiente', '2024-10-22'),
(233, 133, 1, 4, 'pendiente', '2024-10-29'),
(234, 133, 1, 4, 'pendiente', '2024-11-05'),
(235, 133, 1, 3, 'pendiente', '2024-11-26'),
(236, 133, 1, 4, 'pendiente', '2024-11-12'),
(237, 133, 1, 3, 'pendiente', '2024-11-19'),
(238, 133, 1, 4, 'pendiente', '2024-12-03'),
(239, 133, 1, 3, 'pendiente', '2024-12-10'),
(240, 133, 1, 4, 'pendiente', '2024-12-24'),
(241, 133, 1, 1, 'pendiente', '2024-12-17'),
(242, 133, 1, 3, 'pendiente', '2024-12-31'),
(243, 133, 1, 4, 'pendiente', '2025-01-07'),
(244, 133, 1, 1, 'pendiente', '2025-01-21'),
(245, 133, 1, 1, 'pendiente', '2025-01-14'),
(246, 133, 1, 1, 'pendiente', '2025-02-04'),
(247, 133, 1, 4, 'pendiente', '2025-01-28'),
(248, 133, 1, 1, 'pendiente', '2025-02-11'),
(249, 134, 4, 1, 'pendiente', '2024-08-21'),
(250, 134, 4, 3, 'pendiente', '2024-08-28'),
(251, 134, 4, 4, 'pendiente', '2024-09-18'),
(252, 134, 4, 1, 'pendiente', '2024-09-11'),
(253, 134, 4, 1, 'pendiente', '2024-09-04'),
(254, 134, 4, 1, 'pendiente', '2024-09-25'),
(255, 134, 4, 4, 'pendiente', '2024-10-09'),
(256, 134, 4, 3, 'pendiente', '2024-10-02'),
(257, 134, 4, 3, 'pendiente', '2024-10-16'),
(258, 134, 4, 3, 'pendiente', '2024-10-23'),
(259, 134, 4, 1, 'pendiente', '2024-11-06'),
(260, 134, 4, 3, 'pendiente', '2024-10-30'),
(261, 134, 4, 3, 'pendiente', '2024-11-13'),
(262, 134, 4, 3, 'pendiente', '2024-11-20'),
(263, 134, 4, 4, 'pendiente', '2024-11-27'),
(264, 134, 4, 3, 'pendiente', '2024-12-04'),
(265, 134, 4, 4, 'pendiente', '2024-12-18'),
(266, 134, 4, 4, 'pendiente', '2024-12-11'),
(267, 134, 4, 4, 'pendiente', '2024-12-25'),
(268, 134, 4, 3, 'pendiente', '2025-01-08'),
(269, 134, 4, 3, 'pendiente', '2025-01-01'),
(270, 134, 4, 4, 'pendiente', '2025-01-15'),
(271, 134, 4, 4, 'pendiente', '2025-01-22'),
(272, 134, 4, 1, 'pendiente', '2025-02-05'),
(273, 134, 4, 1, 'pendiente', '2025-01-29'),
(274, 134, 4, 3, 'pendiente', '2025-02-12'),
(275, 134, 4, 1, 'pendiente', '2025-02-19'),
(276, 139, 2, 1, 'pendiente', '2024-08-24'),
(277, 139, 2, 3, 'pendiente', '2024-08-31'),
(278, 139, 2, 4, 'pendiente', '2024-09-07'),
(279, 139, 2, 1, 'pendiente', '2024-09-14'),
(280, 139, 2, 1, 'pendiente', '2024-09-21'),
(281, 139, 2, 3, 'pendiente', '2024-10-12'),
(282, 139, 2, 4, 'pendiente', '2024-10-05'),
(283, 139, 2, 3, 'pendiente', '2024-09-28'),
(284, 139, 2, 4, 'pendiente', '2024-10-26'),
(285, 139, 2, 4, 'pendiente', '2024-11-02'),
(286, 139, 2, 1, 'pendiente', '2024-10-19'),
(287, 139, 2, 3, 'pendiente', '2024-11-09'),
(288, 139, 2, 4, 'pendiente', '2024-11-16'),
(289, 139, 2, 4, 'pendiente', '2024-11-23'),
(290, 139, 2, 3, 'pendiente', '2024-11-30'),
(291, 139, 2, 3, 'pendiente', '2024-12-21'),
(292, 139, 2, 4, 'pendiente', '2024-12-07'),
(293, 139, 2, 1, 'pendiente', '2024-12-14'),
(294, 139, 2, 4, 'pendiente', '2025-01-04'),
(295, 139, 2, 4, 'pendiente', '2024-12-28'),
(296, 139, 2, 4, 'pendiente', '2025-01-25'),
(297, 139, 2, 4, 'pendiente', '2025-01-11'),
(298, 139, 2, 3, 'pendiente', '2025-01-18'),
(299, 139, 2, 1, 'pendiente', '2025-02-01'),
(300, 139, 2, 1, 'pendiente', '2025-02-08'),
(301, 139, 2, 3, 'pendiente', '2025-02-15'),
(302, 139, 2, 4, 'pendiente', '2025-02-22'),
(303, 140, 3, 4, 'pendiente', '2024-08-27'),
(304, 140, 3, 4, 'pendiente', '2024-09-03'),
(305, 140, 3, 3, 'pendiente', '2024-09-10'),
(306, 140, 3, 1, 'pendiente', '2024-09-17'),
(307, 140, 3, 3, 'pendiente', '2024-09-24'),
(308, 140, 3, 4, 'pendiente', '2024-10-08'),
(309, 140, 3, 4, 'pendiente', '2024-10-22'),
(310, 140, 3, 3, 'pendiente', '2024-10-01'),
(311, 140, 3, 4, 'pendiente', '2024-10-15'),
(312, 140, 3, 3, 'pendiente', '2024-10-29'),
(313, 140, 3, 3, 'pendiente', '2024-11-19'),
(314, 140, 3, 1, 'pendiente', '2024-11-05'),
(315, 140, 3, 3, 'pendiente', '2024-11-12'),
(316, 140, 3, 4, 'pendiente', '2024-12-03'),
(317, 140, 3, 3, 'pendiente', '2024-11-26'),
(318, 140, 3, 1, 'pendiente', '2024-12-10'),
(319, 140, 3, 4, 'pendiente', '2024-12-17'),
(320, 140, 3, 3, 'pendiente', '2025-01-07'),
(321, 140, 3, 1, 'pendiente', '2024-12-24'),
(322, 140, 3, 4, 'pendiente', '2024-12-31'),
(323, 140, 3, 3, 'pendiente', '2025-01-14'),
(324, 140, 3, 3, 'pendiente', '2025-01-21'),
(325, 140, 3, 4, 'pendiente', '2025-01-28'),
(326, 140, 3, 3, 'pendiente', '2025-02-11'),
(327, 140, 3, 4, 'pendiente', '2025-02-04'),
(328, 140, 3, 3, 'pendiente', '2025-02-18'),
(329, 141, 1, 1, 'pendiente', '2024-08-31'),
(330, 141, 1, 1, 'pendiente', '2024-08-24'),
(331, 141, 1, 4, 'pendiente', '2024-09-07'),
(332, 141, 1, 1, 'pendiente', '2024-09-21'),
(333, 141, 1, 1, 'pendiente', '2024-09-14'),
(334, 141, 1, 1, 'pendiente', '2024-09-28'),
(335, 141, 1, 4, 'pendiente', '2024-10-05'),
(336, 141, 1, 3, 'pendiente', '2024-10-19'),
(337, 141, 1, 4, 'pendiente', '2024-10-26'),
(338, 141, 1, 1, 'pendiente', '2024-10-12'),
(339, 141, 1, 1, 'pendiente', '2024-11-02'),
(340, 141, 1, 3, 'pendiente', '2024-11-23'),
(341, 141, 1, 4, 'pendiente', '2024-11-09'),
(342, 141, 1, 4, 'pendiente', '2024-11-16'),
(343, 141, 1, 1, 'pendiente', '2024-11-30'),
(344, 141, 1, 4, 'pendiente', '2024-12-07'),
(345, 141, 1, 4, 'pendiente', '2024-12-21'),
(346, 141, 1, 1, 'pendiente', '2024-12-14'),
(347, 141, 1, 3, 'pendiente', '2024-12-28'),
(348, 141, 1, 3, 'pendiente', '2025-01-04'),
(349, 141, 1, 3, 'pendiente', '2025-01-11'),
(350, 141, 1, 3, 'pendiente', '2025-01-18'),
(351, 141, 1, 1, 'pendiente', '2025-01-25'),
(352, 141, 1, 3, 'pendiente', '2025-02-01'),
(353, 141, 1, 1, 'pendiente', '2025-02-08'),
(354, 141, 1, 4, 'pendiente', '2025-02-15'),
(355, 141, 1, 4, 'pendiente', '2025-02-22'),
(356, 142, 2, 3, 'pendiente', '2024-08-28'),
(357, 142, 2, 4, 'pendiente', '2024-09-04'),
(358, 142, 2, 1, 'pendiente', '2024-09-11'),
(359, 142, 2, 1, 'pendiente', '2024-09-18'),
(360, 142, 2, 3, 'pendiente', '2024-09-25'),
(361, 142, 2, 4, 'pendiente', '2024-10-09'),
(362, 142, 2, 4, 'pendiente', '2024-10-02'),
(363, 142, 2, 3, 'pendiente', '2024-10-23'),
(364, 142, 2, 3, 'pendiente', '2024-10-16'),
(365, 142, 2, 4, 'pendiente', '2024-10-30'),
(366, 142, 2, 1, 'pendiente', '2024-11-13'),
(367, 142, 2, 4, 'pendiente', '2024-11-06'),
(368, 142, 2, 1, 'pendiente', '2024-11-20'),
(369, 142, 2, 1, 'pendiente', '2024-11-27'),
(370, 142, 2, 1, 'pendiente', '2024-12-04'),
(371, 142, 2, 3, 'pendiente', '2024-12-11'),
(372, 142, 2, 1, 'pendiente', '2024-12-18'),
(373, 142, 2, 1, 'pendiente', '2024-12-25'),
(374, 142, 2, 4, 'pendiente', '2025-01-08'),
(375, 142, 2, 1, 'pendiente', '2025-01-01'),
(376, 142, 2, 1, 'pendiente', '2025-01-15'),
(377, 142, 2, 4, 'pendiente', '2025-01-22'),
(378, 142, 2, 3, 'pendiente', '2025-01-29'),
(379, 142, 2, 4, 'pendiente', '2025-02-12'),
(380, 142, 2, 1, 'pendiente', '2025-02-19'),
(381, 142, 2, 1, 'pendiente', '2025-02-05'),
(382, 143, 1, 4, 'pendiente', '2024-08-26'),
(383, 143, 1, 4, 'pendiente', '2024-09-02'),
(384, 143, 1, 1, 'pendiente', '2024-09-09'),
(385, 143, 1, 3, 'pendiente', '2024-09-16'),
(386, 143, 1, 1, 'pendiente', '2024-09-23'),
(387, 143, 1, 1, 'pendiente', '2024-09-30'),
(388, 143, 1, 3, 'pendiente', '2024-10-07'),
(389, 143, 1, 4, 'pendiente', '2024-10-14'),
(390, 143, 1, 3, 'pendiente', '2024-10-21'),
(391, 143, 1, 4, 'pendiente', '2024-11-04'),
(392, 143, 1, 1, 'pendiente', '2024-11-25'),
(393, 143, 1, 1, 'pendiente', '2024-10-28'),
(394, 143, 1, 3, 'pendiente', '2024-11-11'),
(395, 143, 1, 3, 'pendiente', '2024-11-18'),
(396, 143, 1, 4, 'pendiente', '2024-12-02'),
(397, 143, 1, 1, 'pendiente', '2024-12-16'),
(398, 143, 1, 1, 'pendiente', '2024-12-09'),
(399, 143, 1, 3, 'pendiente', '2024-12-30'),
(400, 143, 1, 1, 'pendiente', '2025-01-13'),
(401, 143, 1, 4, 'pendiente', '2024-12-23'),
(402, 143, 1, 1, 'pendiente', '2025-01-06'),
(403, 143, 1, 4, 'pendiente', '2025-01-20'),
(404, 143, 1, 4, 'pendiente', '2025-02-10'),
(405, 143, 1, 4, 'pendiente', '2025-01-27'),
(406, 143, 1, 1, 'pendiente', '2025-02-17'),
(407, 143, 1, 1, 'pendiente', '2025-02-03');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentario`
--

CREATE TABLE `comentario` (
  `id` int(11) NOT NULL,
  `comentario` varchar(200) NOT NULL,
  `docente` int(11) DEFAULT NULL,
  `salon` int(11) DEFAULT NULL,
  `fecha` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comentario`
--

INSERT INTO `comentario` (`id`, `comentario`, `docente`, `salon`, `fecha`) VALUES
(1, 'el salon contiene un mal olor a la hora de iniciar la clase, necesitamos estar alerta por ese lado', 1, 3, NULL),
(2, 'una ventana está rota, creo que una piedra fue la causa', 3, 2, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_horario`
--

CREATE TABLE `detalle_horario` (
  `id` int(11) NOT NULL,
  `horario` int(11) DEFAULT NULL,
  `dia` enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado') NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_horario`
--

INSERT INTO `detalle_horario` (`id`, `horario`, `dia`, `hora_inicio`, `hora_fin`) VALUES
(21, 120, 'Martes', '10:05:00', '11:55:00'),
(25, 124, 'Sabado', '06:07:00', '10:07:00'),
(28, 128, 'Viernes', '15:30:00', '17:30:00'),
(29, 129, 'Lunes', '10:58:00', '13:58:00'),
(30, 131, 'Martes', '21:05:00', '23:30:00'),
(33, 134, 'Miercoles', '09:00:00', '11:00:00'),
(34, 139, 'Sabado', '10:25:00', '14:10:00'),
(35, 140, 'Martes', '06:04:00', '09:31:00'),
(36, 141, 'Sabado', '12:19:00', '14:19:00'),
(37, 142, 'Miercoles', '10:30:00', '15:24:00'),
(38, 143, 'Lunes', '06:26:00', '07:26:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `director`
--

CREATE TABLE `director` (
  `id` int(11) NOT NULL,
  `persona` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `director`
--

INSERT INTO `director` (`id`, `persona`) VALUES
(1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `docente`
--

CREATE TABLE `docente` (
  `id` int(11) NOT NULL,
  `persona` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `docente`
--

INSERT INTO `docente` (`id`, `persona`) VALUES
(1, 2),
(3, 4);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `horario`
--

CREATE TABLE `horario` (
  `id` int(11) NOT NULL,
  `docente` int(11) DEFAULT NULL,
  `asignatura` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `horario`
--

INSERT INTO `horario` (`id`, `docente`, `asignatura`) VALUES
(113, 1, 'EXPRESION GRAFICA'),
(114, 1, 'ACTIVIDAD CULTURAL Y DEPORTIVA I'),
(115, 3, 'PROGRAMACION I'),
(116, 1, 'ACTIVIDAD CULTURAL Y DEPORTIVA I'),
(119, 1, 'LOGICA MATEMATICA'),
(120, 1, 'INTRODUCCION A LA INGENIERIA DE SISTEMAS'),
(121, 1, 'PROGRAMACION I'),
(122, 3, 'LENGUA EXTRANJERA I (GRAMATICA)'),
(123, 1, 'INTRODUCCION A LA INGENIERIA DE SISTEMAS'),
(124, 1, 'LOGICA MATEMATICA'),
(125, 1, 'CALCULO I'),
(126, 1, 'CATEDRA UPECISTA'),
(127, 1, 'CATEDRA UPECISTA'),
(128, 3, 'FISICA I'),
(129, 1, 'INTRODUCCION A LA INGENIERIA DE SISTEMAS'),
(130, 1, 'PROGRAMACION I'),
(131, 1, 'CALCULO I'),
(132, 1, 'LENGUA EXTRANJERA I (GRAMATICA)'),
(133, 1, 'EXPRESION GRAFICA'),
(134, 3, 'LENGUA EXTRANJERA I (GRAMATICA)'),
(135, 1, 'EXPRESION GRAFICA'),
(136, 1, 'FUNDAMENTOS DE PROGRAMACION'),
(137, 1, 'CATEDRA DE LA PAZ'),
(138, 3, 'INTRODUCCION A LA INGENIERIA DE SISTEMAS'),
(139, 1, 'LENGUA EXTRANJERA I (GRAMATICA)'),
(140, 1, 'LENGUA EXTRANJERA I (GRAMATICA)'),
(141, 1, 'ELECTIVA COMPLEMENTARIA'),
(142, 3, 'ELECTIVA COMPLEMENTARIA'),
(143, 1, 'EXPRESION GRAFICA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificacion`
--

CREATE TABLE `notificacion` (
  `id` int(11) NOT NULL,
  `mensaje` varchar(100) NOT NULL,
  `de` int(11) DEFAULT NULL,
  `para` int(11) DEFAULT NULL,
  `estado` enum('leida','no leida') NOT NULL,
  `fecha` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `persona`
--

CREATE TABLE `persona` (
  `id` int(11) NOT NULL,
  `nombre` varchar(30) NOT NULL,
  `apellido` varchar(30) NOT NULL,
  `cedula` int(10) UNSIGNED NOT NULL,
  `correo` varchar(40) NOT NULL,
  `contrasena` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `persona`
--

INSERT INTO `persona` (`id`, `nombre`, `apellido`, `cedula`, `correo`, `contrasena`) VALUES
(1, 'admin', 'admin1', 1003187623, 'admin12@gmail.com', 'admin123'),
(2, 'didier', 'guerrero', 1007582633, 'didier12@gmail.com', '$2b$10$9Pe6yKMWLqI3s.fBpaLv0utfVWctFTcDaMaLEu/MNu4JuJ.4pEi7q'),
(4, 'nombre', 'apelidyy', 4294967295, 'ramirezHerney@gmail.com', '$2b$10$b0ka.Zc4DHHab402LeENAejKPBUAM6t7FskB0Aclv56siSLhuRhqO'),
(5, 'sapovisor', 'martinez', 1007582611, 'martinez12@gmail.com', 'Martinez_2024!'),
(8, 'name', 'example', 4294967295, 'name2@gmail.com', 'Name123!'),
(9, 'sunga', 'sungurita', 2323232323, 'sunga12@gmail.com', 'sunga123!W');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reporte`
--

CREATE TABLE `reporte` (
  `id` int(11) NOT NULL,
  `clase` int(11) DEFAULT NULL,
  `comentario` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `reporte`
--

INSERT INTO `reporte` (`id`, `clase`, `comentario`) VALUES
(1, 164, 'el docente no sea reportado en su hora de asignada a ala clase'),
(2, 154, 'bien (y)'),
(3, 146, 'bien (Y)'),
(4, 164, 'bien (Y)'),
(5, 275, 'bien (Y)');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salon`
--

CREATE TABLE `salon` (
  `id` int(11) NOT NULL,
  `categoria_salon` int(11) DEFAULT NULL,
  `nombre` varchar(25) NOT NULL,
  `numero_salon` int(11) NOT NULL,
  `capacidad` tinyint(4) NOT NULL,
  `INTernet` enum('si','no') NOT NULL,
  `tv` enum('si','no') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salon`
--

INSERT INTO `salon` (`id`, `categoria_salon`, `nombre`, `numero_salon`, `capacidad`, `INTernet`, `tv`) VALUES
(1, 3, 'bloque nuevo', 223, 23, 'si', 'si'),
(2, 2, 'redes', 212, 34, 'no', 'no'),
(3, 1, 'sala de informatica', 112, 15, 'si', 'no'),
(4, 1, 'salon', 114, 35, 'si', 'si');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `supervisor`
--

CREATE TABLE `supervisor` (
  `id` int(11) NOT NULL,
  `persona` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `supervisor`
--

INSERT INTO `supervisor` (`id`, `persona`) VALUES
(1, 5),
(3, 8),
(4, 9);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categoria_salon`
--
ALTER TABLE `categoria_salon`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clase`
--
ALTER TABLE `clase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `horario` (`horario`),
  ADD KEY `salon` (`salon`),
  ADD KEY `supervisor` (`supervisor`);

--
-- Indices de la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `docente` (`docente`),
  ADD KEY `salon` (`salon`);

--
-- Indices de la tabla `detalle_horario`
--
ALTER TABLE `detalle_horario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `horario` (`horario`);

--
-- Indices de la tabla `director`
--
ALTER TABLE `director`
  ADD PRIMARY KEY (`id`),
  ADD KEY `persona` (`persona`);

--
-- Indices de la tabla `docente`
--
ALTER TABLE `docente`
  ADD PRIMARY KEY (`id`),
  ADD KEY `persona` (`persona`);

--
-- Indices de la tabla `horario`
--
ALTER TABLE `horario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `docente` (`docente`);

--
-- Indices de la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `de` (`de`),
  ADD KEY `para` (`para`);

--
-- Indices de la tabla `persona`
--
ALTER TABLE `persona`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clase` (`clase`);

--
-- Indices de la tabla `salon`
--
ALTER TABLE `salon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre_salon` (`numero_salon`),
  ADD KEY `categoria_salon` (`categoria_salon`);

--
-- Indices de la tabla `supervisor`
--
ALTER TABLE `supervisor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `persona` (`persona`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categoria_salon`
--
ALTER TABLE `categoria_salon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clase`
--
ALTER TABLE `clase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=408;

--
-- AUTO_INCREMENT de la tabla `comentario`
--
ALTER TABLE `comentario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalle_horario`
--
ALTER TABLE `detalle_horario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT de la tabla `director`
--
ALTER TABLE `director`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `docente`
--
ALTER TABLE `docente`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `horario`
--
ALTER TABLE `horario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=144;

--
-- AUTO_INCREMENT de la tabla `persona`
--
ALTER TABLE `persona`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `reporte`
--
ALTER TABLE `reporte`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `salon`
--
ALTER TABLE `salon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `supervisor`
--
ALTER TABLE `supervisor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `clase`
--
ALTER TABLE `clase`
  ADD CONSTRAINT `clase_ibfk_1` FOREIGN KEY (`horario`) REFERENCES `horario` (`id`),
  ADD CONSTRAINT `clase_ibfk_2` FOREIGN KEY (`salon`) REFERENCES `salon` (`id`),
  ADD CONSTRAINT `clase_ibfk_3` FOREIGN KEY (`supervisor`) REFERENCES `supervisor` (`id`);

--
-- Filtros para la tabla `comentario`
--
ALTER TABLE `comentario`
  ADD CONSTRAINT `comentario_ibfk_1` FOREIGN KEY (`docente`) REFERENCES `docente` (`id`),
  ADD CONSTRAINT `comentario_ibfk_2` FOREIGN KEY (`salon`) REFERENCES `salon` (`id`);

--
-- Filtros para la tabla `detalle_horario`
--
ALTER TABLE `detalle_horario`
  ADD CONSTRAINT `detalle_horario_ibfk_1` FOREIGN KEY (`horario`) REFERENCES `horario` (`id`);

--
-- Filtros para la tabla `director`
--
ALTER TABLE `director`
  ADD CONSTRAINT `director_ibfk_1` FOREIGN KEY (`persona`) REFERENCES `persona` (`id`);

--
-- Filtros para la tabla `docente`
--
ALTER TABLE `docente`
  ADD CONSTRAINT `docente_ibfk_1` FOREIGN KEY (`persona`) REFERENCES `persona` (`id`);

--
-- Filtros para la tabla `horario`
--
ALTER TABLE `horario`
  ADD CONSTRAINT `horario_ibfk_1` FOREIGN KEY (`docente`) REFERENCES `docente` (`id`);

--
-- Filtros para la tabla `notificacion`
--
ALTER TABLE `notificacion`
  ADD CONSTRAINT `notificacion_ibfk_1` FOREIGN KEY (`de`) REFERENCES `persona` (`id`),
  ADD CONSTRAINT `notificacion_ibfk_2` FOREIGN KEY (`para`) REFERENCES `persona` (`id`);

--
-- Filtros para la tabla `reporte`
--
ALTER TABLE `reporte`
  ADD CONSTRAINT `reporte_ibfk_1` FOREIGN KEY (`clase`) REFERENCES `clase` (`id`);

--
-- Filtros para la tabla `salon`
--
ALTER TABLE `salon`
  ADD CONSTRAINT `salon_ibfk_1` FOREIGN KEY (`categoria_salon`) REFERENCES `categoria_salon` (`id`);

--
-- Filtros para la tabla `supervisor`
--
ALTER TABLE `supervisor`
  ADD CONSTRAINT `supervisor_ibfk_1` FOREIGN KEY (`persona`) REFERENCES `persona` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

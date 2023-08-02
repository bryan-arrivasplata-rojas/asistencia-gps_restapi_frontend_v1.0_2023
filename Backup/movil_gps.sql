-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-03-2023 a las 07:07:12
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `movil_gps`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia`
--

CREATE TABLE `asistencia` (
  `id` int(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `cod_oseccion` int(10) NOT NULL,
  `cod_asistencia_habilitado` int(10) NOT NULL,
  `distancia` float(4,2) NOT NULL,
  `fecha_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `asistencia`
--

INSERT INTO `asistencia` (`id`, `email`, `cod_oseccion`, `cod_asistencia_habilitado`, `distancia`, `fecha_created`) VALUES
(57, 'barrivasplatar@uni.pe', 1, 76, 8.01, '2023-03-02 18:47:20');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `asistencia_habilitado`
--

CREATE TABLE `asistencia_habilitado` (
  `cod_asistencia_habilitado` int(10) NOT NULL,
  `cod_op_semana` int(10) NOT NULL,
  `num_solicitud` int(2) NOT NULL,
  `distancia_maxima` float(4,2) NOT NULL DEFAULT 0.00,
  `tiempo_cerrar_num_solicitud` int(3) NOT NULL DEFAULT 0,
  `habilitado` int(1) NOT NULL DEFAULT 0,
  `cod_oseccion` int(10) NOT NULL,
  `cod_aula` varchar(50) NOT NULL,
  `fecha_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `asistencia_habilitado`
--

INSERT INTO `asistencia_habilitado` (`cod_asistencia_habilitado`, `cod_op_semana`, `num_solicitud`, `distancia_maxima`, `tiempo_cerrar_num_solicitud`, `habilitado`, `cod_oseccion`, `cod_aula`, `fecha_created`) VALUES
(1, 6, 1, 2.00, 150, 1, 3, '2', '2023-02-16 15:51:47'),
(60, 7, 1, 8.50, 150, 1, 3, '1', '2023-02-24 01:41:36'),
(72, 8, 1, 1.50, 0, 1, 1, '1', '2023-03-01 21:54:59'),
(74, 8, 2, 15.30, 110, 1, 1, '1', '2023-03-01 23:00:24'),
(76, 8, 3, 15.20, 0, 1, 1, '1', '2023-03-02 16:50:40'),
(77, 8, 4, 15.20, 0, 0, 1, '1', '2023-03-02 18:50:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `aula`
--

CREATE TABLE `aula` (
  `cod_aula` varchar(50) NOT NULL,
  `cod_facultad` int(2) NOT NULL,
  `latitud` double(14,10) DEFAULT NULL,
  `longitud` double(14,10) DEFAULT NULL,
  `referencia` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `aula`
--

INSERT INTO `aula` (`cod_aula`, `cod_facultad`, `latitud`, `longitud`, `referencia`) VALUES
('1', 1, -12.0480500000, -77.0544350000, 'Laboratorio A'),
('2', 1, -12.0480500000, -77.0544350000, 'Laboratorio B'),
('SI402', 4, -12.1564561651, 18.1541548181, 'Frente a Recepcion');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `curso`
--

CREATE TABLE `curso` (
  `cod_curso` varchar(10) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `cod_facultad` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `curso`
--

INSERT INTO `curso` (`cod_curso`, `descripcion`, `cod_facultad`) VALUES
('FB401', 'Física II', 1),
('GA122', 'Calidad, Contaminación y Conflictos Ambientales', 5),
('SI901', 'Proyecto de Tesis en Ingeniería de Sistemas I', 1),
('SI902', 'Ingeniería de Sistemas de Servicios', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facultad`
--

CREATE TABLE `facultad` (
  `cod_facultad` int(2) NOT NULL,
  `descripcion` varchar(100) NOT NULL,
  `abreviatura` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `facultad`
--

INSERT INTO `facultad` (`cod_facultad`, `descripcion`, `abreviatura`) VALUES
(1, 'Facultad de Ingeniería Industrial y de Sistemas', 'FIIS'),
(2, 'Facultad de Ingeniería Eléctrica y Electrónica', 'FIEE'),
(4, 'Facultad de Ingeniería Civil', 'FIC'),
(5, 'Facultad de Ingeniería Ambiental', 'FIA'),
(6, 'Facultad de Ingeniería Geológia, Minera y Metalúrgica', 'FIGMM'),
(7, 'Facultad de Ingeniería Química y Textil', 'FIQT'),
(8, 'Facultad de Arquitectura, Urbanismo y Artes', 'FAUA'),
(9, 'Facultad de Ciencias', 'FC'),
(10, 'Facultad de Ingeniería de Petróleo, Gas Natural y Petroquímica', 'FIP'),
(11, 'Facultad de Ingeniería Económica, Estadística y Ciencias Sociales', 'FIECS'),
(12, 'Facultad de Ingeniería Mecánica', 'FIM');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ocurso`
--

CREATE TABLE `ocurso` (
  `cod_ocurso` int(10) NOT NULL,
  `cod_curso` varchar(10) NOT NULL,
  `cod_op` int(10) NOT NULL,
  `fecha_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `ocurso`
--

INSERT INTO `ocurso` (`cod_ocurso`, `cod_curso`, `cod_op`, `fecha_created`) VALUES
(1, 'SI901', 1, '2023-01-09 16:40:22'),
(2, 'SI902', 1, '2023-01-09 16:40:22');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `op_semana`
--

CREATE TABLE `op_semana` (
  `cod_op_semana` int(10) NOT NULL,
  `cod_op` int(10) NOT NULL,
  `num_semana` int(2) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_final` datetime NOT NULL,
  `fecha_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `op_semana`
--

INSERT INTO `op_semana` (`cod_op_semana`, `cod_op`, `num_semana`, `fecha_inicio`, `fecha_final`, `fecha_created`) VALUES
(1, 1, 1, '2023-01-09 00:00:00', '2023-01-15 23:59:59', '2023-01-11 10:32:35'),
(2, 1, 2, '2023-01-16 00:00:00', '2023-01-22 23:59:59', '2023-01-11 10:32:35'),
(3, 1, 3, '2023-01-23 00:00:00', '2023-01-29 23:59:59', '2023-01-11 10:32:35'),
(4, 1, 4, '2023-01-30 00:00:00', '2023-02-05 23:59:59', '2023-01-24 18:20:06'),
(5, 1, 5, '2023-02-06 00:00:00', '2023-02-12 23:59:59', '2023-01-24 18:20:06'),
(6, 1, 6, '2023-02-13 00:00:00', '2023-02-19 23:59:59', '2023-01-24 18:20:06'),
(7, 1, 7, '2023-02-20 00:00:00', '2023-02-26 23:59:59', '2023-01-24 18:20:06'),
(8, 1, 8, '2023-02-27 00:00:00', '2023-03-05 23:59:59', '2023-01-24 18:20:06');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orden_pedido`
--

CREATE TABLE `orden_pedido` (
  `cod_op` int(10) NOT NULL,
  `cod_facultad` int(2) NOT NULL,
  `cod_tipo_ciclo` int(2) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `fecha_inicio` datetime NOT NULL,
  `fecha_final` datetime NOT NULL,
  `fecha_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `orden_pedido`
--

INSERT INTO `orden_pedido` (`cod_op`, `cod_facultad`, `cod_tipo_ciclo`, `descripcion`, `fecha_inicio`, `fecha_final`, `fecha_created`) VALUES
(1, 1, 2, '2022-3', '2023-01-09 00:00:00', '2023-03-05 23:59:59', '2023-01-09 16:38:00'),
(3, 1, 26, '2023-1', '2023-04-01 00:00:00', '2023-07-31 23:59:59', '2023-02-26 18:04:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `oseccion`
--

CREATE TABLE `oseccion` (
  `cod_oseccion` int(10) NOT NULL,
  `cod_ocurso` int(10) NOT NULL,
  `cod_seccion` varchar(10) NOT NULL,
  `fecha_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `oseccion`
--

INSERT INTO `oseccion` (`cod_oseccion`, `cod_ocurso`, `cod_seccion`, `fecha_created`) VALUES
(1, 1, 'U', '2023-01-09 16:43:01'),
(2, 1, 'V', '2023-01-09 16:43:01'),
(3, 2, 'U', '2023-01-09 16:43:42');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil`
--

CREATE TABLE `perfil` (
  `codigo` varchar(10) NOT NULL,
  `primer_nombre` varchar(50) NOT NULL,
  `segundo_nombre` varchar(50) NOT NULL,
  `tercer_nombre` varchar(50) NOT NULL,
  `apellido_paterno` varchar(50) NOT NULL,
  `apellido_materno` varchar(50) NOT NULL,
  `tipo` int(1) NOT NULL,
  `email` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `perfil`
--

INSERT INTO `perfil` (`codigo`, `primer_nombre`, `segundo_nombre`, `tercer_nombre`, `apellido_paterno`, `apellido_materno`, `tipo`, `email`) VALUES
('20152658G', 'Dante', 'Luz', 'Per', 'Rios', 'Gutbet', 2, 'administrativo@uni.pe'),
('20165669U', 'Dani', 'Giomar', '', 'Rojas', 'Rivas', 1, 'alumno@uni.pe'),
('20172657B', 'Bryan', 'Daniell', '', 'Arrivasplata', 'Rojas', 1, 'barrivasplatar@uni.pe'),
('20182689C', 'Dani', 'Christopher', 'Jonathan', 'null', 'Rodriguez', 1, 'jcalvinr@uni.pe');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `seccion`
--

CREATE TABLE `seccion` (
  `cod_seccion` varchar(10) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `seccion`
--

INSERT INTO `seccion` (`cod_seccion`, `descripcion`) VALUES
('I', 'Sección I'),
('U', 'Sección U'),
('V', 'Sección V'),
('X', 'Sección X');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo`
--

CREATE TABLE `tipo` (
  `tipo` int(1) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `tipo`
--

INSERT INTO `tipo` (`tipo`, `descripcion`) VALUES
(1, 'Alumno'),
(2, 'Docente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_ciclo`
--

CREATE TABLE `tipo_ciclo` (
  `cod_tipo_ciclo` int(2) NOT NULL,
  `semanas` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `tipo_ciclo`
--

INSERT INTO `tipo_ciclo` (`cod_tipo_ciclo`, `semanas`) VALUES
(1, 16),
(2, 8),
(26, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `token` varchar(200) DEFAULT NULL,
  `fecha_created` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`email`, `password`, `token`, `fecha_created`) VALUES
('administrativo@uni.pe', '123456', NULL, '2023-01-09 10:41:59'),
('alumno@uni.pe', '123456', NULL, '2023-01-09 10:41:59'),
('barrivasplatar@uni.pe', '123456', NULL, '2023-01-09 00:00:00'),
('bryanbdar14@gmail.com', '123456789', NULL, '2023-02-22 20:11:14'),
('jcalvinr@uni.pe', '123456789', 'null', '2023-01-09 10:00:16');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_seccion`
--

CREATE TABLE `usuario_seccion` (
  `id` int(10) NOT NULL,
  `email` varchar(50) NOT NULL,
  `cod_oseccion` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish2_ci;

--
-- Volcado de datos para la tabla `usuario_seccion`
--

INSERT INTO `usuario_seccion` (`id`, `email`, `cod_oseccion`) VALUES
(1, 'administrativo@uni.pe', 1),
(2, 'alumno@uni.pe', 1),
(3, 'barrivasplatar@uni.pe', 1),
(4, 'barrivasplatar@uni.pe', 3),
(5, 'jcalvinr@uni.pe', 3),
(6, 'jcalvinr@uni.pe', 1),
(7, 'administrativo@uni.pe', 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ASISTENCIA_ASISTENCIA_HABILITADO` (`cod_asistencia_habilitado`);

--
-- Indices de la tabla `asistencia_habilitado`
--
ALTER TABLE `asistencia_habilitado`
  ADD PRIMARY KEY (`cod_asistencia_habilitado`),
  ADD KEY `FK_ASISTENCIA_ASISTENCIA_HABILITADO_OP_SEMANA` (`cod_op_semana`),
  ADD KEY `FK_ASISTENCIA_HABILITADO_USUARIO_SECCION_AULA` (`cod_aula`);

--
-- Indices de la tabla `aula`
--
ALTER TABLE `aula`
  ADD PRIMARY KEY (`cod_aula`),
  ADD KEY `FK_AULA_FACULTAD` (`cod_facultad`);

--
-- Indices de la tabla `curso`
--
ALTER TABLE `curso`
  ADD PRIMARY KEY (`cod_curso`),
  ADD KEY `FK_CURSO_FACULTAD` (`cod_facultad`);

--
-- Indices de la tabla `facultad`
--
ALTER TABLE `facultad`
  ADD PRIMARY KEY (`cod_facultad`);

--
-- Indices de la tabla `ocurso`
--
ALTER TABLE `ocurso`
  ADD PRIMARY KEY (`cod_ocurso`),
  ADD KEY `FK_OCURSO_CURSO` (`cod_curso`),
  ADD KEY `FK_OCURSO_OP` (`cod_op`);

--
-- Indices de la tabla `op_semana`
--
ALTER TABLE `op_semana`
  ADD PRIMARY KEY (`cod_op_semana`),
  ADD KEY `FK_OP_SEMANA_OP` (`cod_op`);

--
-- Indices de la tabla `orden_pedido`
--
ALTER TABLE `orden_pedido`
  ADD PRIMARY KEY (`cod_op`),
  ADD KEY `FK_OP_TIPO_CICLO` (`cod_tipo_ciclo`),
  ADD KEY `FK_OP_FACULTAD` (`cod_facultad`);

--
-- Indices de la tabla `oseccion`
--
ALTER TABLE `oseccion`
  ADD PRIMARY KEY (`cod_oseccion`),
  ADD KEY `FK_OSECCION_SECCION` (`cod_seccion`),
  ADD KEY `FK_OSECCION_OCURSO` (`cod_ocurso`);

--
-- Indices de la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `FK_PERFIL_TIPO` (`tipo`),
  ADD KEY `FK_PERFIL_USUARIO` (`email`);

--
-- Indices de la tabla `seccion`
--
ALTER TABLE `seccion`
  ADD PRIMARY KEY (`cod_seccion`);

--
-- Indices de la tabla `tipo`
--
ALTER TABLE `tipo`
  ADD PRIMARY KEY (`tipo`);

--
-- Indices de la tabla `tipo_ciclo`
--
ALTER TABLE `tipo_ciclo`
  ADD PRIMARY KEY (`cod_tipo_ciclo`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`email`);

--
-- Indices de la tabla `usuario_seccion`
--
ALTER TABLE `usuario_seccion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `USUARIO_SECCION_USUARIO` (`email`),
  ADD KEY `USUARIO_SECCION` (`cod_oseccion`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `asistencia`
--
ALTER TABLE `asistencia`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT de la tabla `asistencia_habilitado`
--
ALTER TABLE `asistencia_habilitado`
  MODIFY `cod_asistencia_habilitado` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT de la tabla `facultad`
--
ALTER TABLE `facultad`
  MODIFY `cod_facultad` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `ocurso`
--
ALTER TABLE `ocurso`
  MODIFY `cod_ocurso` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `op_semana`
--
ALTER TABLE `op_semana`
  MODIFY `cod_op_semana` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `orden_pedido`
--
ALTER TABLE `orden_pedido`
  MODIFY `cod_op` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `oseccion`
--
ALTER TABLE `oseccion`
  MODIFY `cod_oseccion` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tipo_ciclo`
--
ALTER TABLE `tipo_ciclo`
  MODIFY `cod_tipo_ciclo` int(2) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT de la tabla `usuario_seccion`
--
ALTER TABLE `usuario_seccion`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `asistencia`
--
ALTER TABLE `asistencia`
  ADD CONSTRAINT `FK_ASISTENCIA_ASISTENCIA_HABILITADO` FOREIGN KEY (`cod_asistencia_habilitado`) REFERENCES `asistencia_habilitado` (`cod_asistencia_habilitado`);

--
-- Filtros para la tabla `asistencia_habilitado`
--
ALTER TABLE `asistencia_habilitado`
  ADD CONSTRAINT `FK_ASISTENCIA_ASISTENCIA_HABILITADO_OP_SEMANA` FOREIGN KEY (`cod_op_semana`) REFERENCES `op_semana` (`cod_op_semana`),
  ADD CONSTRAINT `FK_ASISTENCIA_HABILITADO_USUARIO_SECCION_AULA` FOREIGN KEY (`cod_aula`) REFERENCES `aula` (`cod_aula`);

--
-- Filtros para la tabla `aula`
--
ALTER TABLE `aula`
  ADD CONSTRAINT `FK_AULA_FACULTAD` FOREIGN KEY (`cod_facultad`) REFERENCES `facultad` (`cod_facultad`);

--
-- Filtros para la tabla `curso`
--
ALTER TABLE `curso`
  ADD CONSTRAINT `FK_CURSO_FACULTAD` FOREIGN KEY (`cod_facultad`) REFERENCES `facultad` (`cod_facultad`);

--
-- Filtros para la tabla `ocurso`
--
ALTER TABLE `ocurso`
  ADD CONSTRAINT `FK_OCURSO_CURSO` FOREIGN KEY (`cod_curso`) REFERENCES `curso` (`cod_curso`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_OCURSO_OP` FOREIGN KEY (`cod_op`) REFERENCES `orden_pedido` (`cod_op`);

--
-- Filtros para la tabla `op_semana`
--
ALTER TABLE `op_semana`
  ADD CONSTRAINT `FK_OP_SEMANA_OP` FOREIGN KEY (`cod_op`) REFERENCES `orden_pedido` (`cod_op`);

--
-- Filtros para la tabla `orden_pedido`
--
ALTER TABLE `orden_pedido`
  ADD CONSTRAINT `FK_OP_FACULTAD` FOREIGN KEY (`cod_facultad`) REFERENCES `facultad` (`cod_facultad`),
  ADD CONSTRAINT `FK_OP_TIPO_CICLO` FOREIGN KEY (`cod_tipo_ciclo`) REFERENCES `tipo_ciclo` (`cod_tipo_ciclo`);

--
-- Filtros para la tabla `oseccion`
--
ALTER TABLE `oseccion`
  ADD CONSTRAINT `FK_OSECCION_OCURSO` FOREIGN KEY (`cod_ocurso`) REFERENCES `ocurso` (`cod_ocurso`),
  ADD CONSTRAINT `FK_OSECCION_SECCION` FOREIGN KEY (`cod_seccion`) REFERENCES `seccion` (`cod_seccion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD CONSTRAINT `FK_PERFIL_TIPO` FOREIGN KEY (`tipo`) REFERENCES `tipo` (`tipo`),
  ADD CONSTRAINT `FK_PERFIL_USUARIO` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`);

--
-- Filtros para la tabla `usuario_seccion`
--
ALTER TABLE `usuario_seccion`
  ADD CONSTRAINT `USUARIO_SECCION` FOREIGN KEY (`cod_oseccion`) REFERENCES `oseccion` (`cod_oseccion`),
  ADD CONSTRAINT `USUARIO_SECCION_USUARIO` FOREIGN KEY (`email`) REFERENCES `usuario` (`email`) ON DELETE NO ACTION ON UPDATE NO ACTION;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

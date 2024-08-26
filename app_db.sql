CREATE DATABASE IF NOT EXISTS app;
USE app;

CREATE TABLE IF NOT EXISTS persona (
	id INT auto_increment PRIMARY KEY,
    nombre VARCHAR(30) NOT NULL,
    apellido VARCHAR(30) NOT NULL,
    cedula INT(10) UNSIGNED NOT NULL,
    correo VARCHAR(40) unique NOT NULL,
    contrasena VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS director (
	id INT auto_increment PRIMARY KEY,
    persona INT,
    FOREIGN KEY (persona) references persona(id)
);

CREATE TABLE IF NOT EXISTS supervisor (
	id INT auto_increment PRIMARY KEY,
    persona INT,
    FOREIGN KEY (persona) references persona(id)
);

CREATE TABLE IF NOT EXISTS docente (
	id INT auto_increment PRIMARY KEY,
    persona INT, 
    FOREIGN KEY (persona) references persona(id)
);

CREATE TABLE IF NOT EXISTS horario (
	id INT auto_increment PRIMARY KEY,
    docente INT ,
    asignatura VARCHAR(100) NOT NULL,
    FOREIGN KEY (docente) references docente(id)
);

CREATE TABLE IF NOT EXISTS detalle_horario (
	id INT auto_increment PRIMARY KEY,
    horario INT ,
    dia enum('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado') NOT NULL,
    hora_inicio time NOT NULL,
    hora_fin time NOT NULL,
    FOREIGN KEY (horario) references horario(id)
);

CREATE TABLE IF NOT EXISTS categoria_salon (
	id INT auto_increment PRIMARY KEY,
    categoria enum('salon', 'laboratorio', 'aulario')
);

CREATE TABLE IF NOT EXISTS salon (
	id INT auto_increment PRIMARY KEY,
    categoria_salon INT ,
    numero_salon INT ,
    nombre VARCHAR(50) NOT NULL,
    capacidad tinyINT NOT NULL,
    INTernet enum('si', 'no') NOT NULL,
    tv enum('si', 'no') NOT NULL, 
    FOREIGN KEY (categoria_salon) references categoria_salon(id)
);

CREATE TABLE IF NOT EXISTS comentario (
	id INT auto_increment PRIMARY KEY,
    comentario VARCHAR(200) NOT NULL, 
    docente INT ,
    salon INT ,
    FOREIGN KEY (docente) references docente(id),
    FOREIGN KEY (salon) references salon(id)
);

CREATE TABLE IF NOT EXISTS clase (
	id INT auto_increment PRIMARY KEY,
    horario INT ,
    salon INT ,
    supervisor INT ,
    estado enum('completada', 'perdida', 'pendiente') NOT NULL,
    fecha date NOT NULL,
    FOREIGN KEY (horario) references horario(id),
    FOREIGN KEY (salon) references salon(id),
    FOREIGN KEY (supervisor) references supervisor(id)
);

CREATE TABLE IF NOT EXISTS reporte (
	id INT auto_increment PRIMARY KEY,
    clase INT ,
    comentario VARCHAR(250) NOT NULL,
    FOREIGN KEY (clase) references clase(id)
);


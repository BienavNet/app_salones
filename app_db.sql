CREATE DATABASE app;
USE app;

CREATE TABLE IF NOT EXISTS persona (
	id int auto_increment primary key,
    nombre varchar(30) not null,
    apellido varchar(30) not null,
    cedula int(10) unsigned not null,
    correo varchar(40) not null,
    contrasena varchar(40) not null
);

CREATE TABLE IF NOT EXISTS director (
	id int auto_increment primary key,
    persona int,
    foreign key (persona) references persona(id)
);

CREATE TABLE IF NOT EXISTS supervisor (
	id int auto_increment primary key,
    persona int ,
    foreign key (persona) references persona(id)
);

CREATE TABLE IF NOT EXISTS docente (
	id int auto_increment primary key,
    persona int , 
    foreign key (persona) references persona(id)
);

CREATE TABLE IF NOT EXISTS horario (
	id int auto_increment primary key,
    docente int ,
    asignatura varchar(30) not null,
    foreign key (docente) references docente(id)
);

CREATE TABLE IF NOT EXISTS detalle_horario (
	id int auto_increment primary key,
    horario int ,
    dia enum('Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado') not null,
    hora_inicio time not null,
    hora_fin time not null,
    foreign key (horario) references horario(id)
);

CREATE TABLE IF NOT EXISTS categoria_salon (
	id int auto_increment primary key,
    categoria enum('salon', 'laboratorio', 'aulario')
);

CREATE TABLE IF NOT EXISTS salon (
	id int auto_increment primary key,
    categoria_salon int ,
    nombre varchar(25) not null,
    capacidad tinyint not null,
    internet enum('si', 'no') not null,
    tv enum('si', 'no') not null, 
    foreign key (categoria_salon) references categoria_salon(id)
);

CREATE TABLE IF NOT EXISTS comentario (
	id int auto_increment primary key,
    comentario varchar(200) not null, 
    docente int ,
    salon int ,
    foreign key (docente) references docente(id),
    foreign key (salon) references salon(id)
);

CREATE TABLE IF NOT EXISTS clase (
	id int auto_increment primary key,
    horario int ,
    salon int ,
    supervisor int ,
    estado enum('completada', 'perdida') not null,
    fecha date not null,
    foreign key (horario) references horario(id),
    foreign key (salon) references salon(id),
    foreign key (supervisor) references supervisor(id)
);

CREATE TABLE IF NOT EXISTS reporte (
	id int auto_increment primary key,
    clase int ,
    comentario varchar(250) not null,
    foreign key (clase) references clase(id)
);


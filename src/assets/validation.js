export class Validaciones {
    static nombre(nombre) {
        if (typeof nombre !== 'string') throw new Error('Nombre debe ser una cadena de texto');
        if (nombre.trim().length === 0) throw new Error('Nombre no puede estar vacío');
        if (nombre.length < 3) throw new Error('Nombre debe tener al menos 3 caracteres');
        if (nombre.length > 30) throw new Error('Nombre no puede ser mas de 30 caracteres');
    }

    static apellido(apellido) {
        if (typeof apellido !== 'string') throw new Error('Apellido debe ser una cadena de texto');
        if (apellido.trim().length === 0) throw new Error('Apellido no puede estar vacío');
        if (apellido.length < 3) throw new Error('Apellido debe tener al menos 3 caracteres');
        if (apellido.length > 30) throw new Error('Nombre no puede ser mas de 30 caracteres');
    }

    static cedula(cedula) {
        if (cedula.trim().length === 0) throw new Error('Cedula no puede estar vacío');
        if (typeof cedula !== 'number'|| !Number.isInteger(cedula)) throw new Error('Cédula debe ser un número');
        if (cedula.toString().length > 10) throw new Error('La cédula debe tener no puede ser mayor a 10 caracteres');
        if (cedula.toString().length < 8) throw new Error('La cédula debe tener no puede ser menor a 10 caracteres');
    }

    static correo(correo) {
        if (correo.trim().length === 0) throw new Error('Correo no puede estar vacío');
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (typeof correo !== 'string') throw new Error('Correo debe ser una cadena de texto');
        if (!emailRegex.test(correo)) throw new Error('Correo debe tener un formato válido');
        if (correo.length < 4) throw new Error('Contraseña debe tener al menos 6 caracteres');
        if (correo.length > 100) throw new Error('Contraseña debe no debe ser mayor a 16 caracteres');
    }

    static contrasena(contrasena) {
        if (contrasena.trim().length === 0) throw new Error('Contraseña no puede estar vacío');
        if (typeof contrasena !== 'string') throw new Error('Contraseña debe ser una cadena de texto');
        if (contrasena.length < 4) throw new Error('Contraseña debe tener al menos 6 caracteres');
        if (contrasena.length > 16) throw new Error('Contraseña debe no debe ser mayor a 16 caracteres');
    }

    static role(rol){
        const validRoles = ['docente', 'director', 'supervisor']
        if (rol.trim().length === 0) throw new Error('Rol no puede estar vacío');
        if (typeof rol !== 'string') throw new Error('rol debe ser una cadena de texto')
        if(!validRoles.includes(rol)) throw new Error('Por favor, verfique su rol asignado');
    }
  }
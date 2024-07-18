export class Validaciones {
    static nombre(nombre) {
        if (typeof nombre !== 'string') throw new Error('Nombre debe ser una cadena de texto');
        if (nombre.length < 3) throw new Error('Nombre debe tener al menos 3 caracteres');
        if (nombre.length > 30) throw new Error('Nombre no puede ser mas de 30 caracteres');
    }

    static apellido(apellido) {
        if (typeof apellido !== 'string') throw new Error('Apellido debe ser una cadena de texto');
        if (apellido.length < 3) throw new Error('Apellido debe tener al menos 3 caracteres');
        if (apellido.length > 30) throw new Error('Nombre no puede ser mas de 30 caracteres');
    }

    static cedula(cedula) {
        if (typeof cedula !== 'number') throw new Error('Cédula debe ser un número');
        if (cedula.toString().length !== 10) throw new Error('La cédula debe tener exactamente 10 caracteres.');
    }

    static correo(correo) {
        const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
        if (typeof correo !== 'string') throw new Error('Correo debe ser una cadena de texto');
        if (!emailRegex.test(correo)) throw new Error('Correo debe tener un formato válido');
        if (correo.length < 4) throw new Error('Contraseña debe tener al menos 6 caracteres');
        if (correo.length > 100) throw new Error('Contraseña debe no debe ser mayor a 16 caracteres');
    }

    static contrasena(contrasena) {
        if (typeof contrasena !== 'string') throw new Error('Contraseña debe ser una cadena de texto');
        if (contrasena.length < 4) throw new Error('Contraseña debe tener al menos 6 caracteres');
        if (contrasena.length > 16) throw new Error('Contraseña debe no debe ser mayor a 16 caracteres');
    }
  }
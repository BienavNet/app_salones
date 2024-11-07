import { connection } from "./../database/database.js";
import { Validaciones } from "../assets/validation.js";
import bcrypt from "bcryptjs";
import { SALTROUNDS } from "../config.js";

/* Este metodo obtiene los registros de la tabla siempre y cuando el parametro pasado coincida con la cedula del docente*/
const getDocentes = async (req, res, next) => {
  try {
    const [result] = await connection.query(
      "SELECT persona.apellido, persona.nombre, persona.correo, persona.cedula , docente.id as docente_id FROM persona INNER JOIN docente ON persona.id = docente.persona"
    );
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo obtiene el id de la tabla si los parametros coinciden con la cedula del docente */
const getDocenteIdByCedula = async (req, res) => {
  try {
    const { cedula } = req.params;
    if (!cedula) {
      return res.status(400).send("Bad Request: Missing cedula");
    }

    try {
      const [result] = await connection.query(
        `
       SELECT persona.*, docente.id as docente_id, docente.persona as persona_id FROM docente INNER JOIN persona ON persona.id = docente.persona WHERE persona.cedula = ?`,
        [cedula]
      );
      return res.status(200).json(result);
    } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo obtiene los registros de la tabla si el parametro coincide con la cedula del docente */
const getDocenteByCedula = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;

      //const [result] = await connection.query("SELECT p.*, d.* FROM persona as p, docente as d WHERE p.cedula = " +cedula+ " and d.persona = p.id")
      const [result] = await connection.query(
        "SELECT persona.*, docente.id as docente_id FROM persona INNER JOIN docente ON persona.id = docente.persona WHERE persona.cedula = " +
          "cedula" +
          ";"
      );
      return res.status(200).json(result);
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo obtiene los registros de la tabla si el parametro coincide con el correo */
const getPersonaByCorreo = async (correo, cedula) => {
  const query = `
    SELECT * 
    FROM persona 
    WHERE correo = ? OR cedula = ? 
    LIMIT 1;
  `;
  try {
    const [result] = await connection.query(query, [correo, cedula]);
    if (result.length === 0) {
      return null; // No se encontró la persona
    }
    return result;
  } catch (error) {
    console.error("Error en la consulta de persona:", error);
    throw new Error({
      status: 500,
      message: "Internal Server Error:" + error.message,
    });
  }
};

/* Este metodo obtiene los registros de la tabla si el parametro coincide con la cedula */
const getCedulaDocente = async (cedula) => {
  const query = `
  SELECT persona.*, docente.id as docente_id 
  FROM persona
  INNER JOIN docente ON persona.id = docente.persona
  WHERE persona.cedula = ?`;
  try {
    const [result] = await connection.query(query, [cedula]);
    return result.length === 0 ? null : result;
  } catch (error) {
    throw new Error({
      status: 500,
      message: "Internal Server Error:" + error.message,
    });
  }
};

/* Este metodo obtiene los registros de una tabla si el parametro coincide con el correo */
const getDocenteByCorreo = async (correo) => {
  const query = `
  SELECT persona.*, docente.id as docente_id 
  FROM persona 
  INNER JOIN docente ON persona.id = docente.persona 
  WHERE persona.correo = ?`;
  try {
    const [result] = await connection.query(query, [correo]);
    return result.length === 0 ? null : result;
  } catch (error) {
    throw new Error({
      status: 500,
      message: "Internal Server Error:" + error.message,
    });
  }
};

/* Este metodo almacena registros en la tabla docente */
const saveDocente = async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Bad Request.");
  }
  const { nombre, apellido, cedula, correo, contrasena } = req.body;
  try {
    // validaciones simples
    Validaciones.nombre(nombre);
    Validaciones.apellido(apellido);
    Validaciones.cedula(cedula);
    Validaciones.correo(correo);
    Validaciones.contrasena(contrasena);
  } catch (validationError) {
    return res
      .status(400)
      .json({ status: "Bad Request.", message: validationError.message });
  }

  try {
    const persona = await getPersonaByCorreo(correo, cedula);
    if (persona) {
      const isDocentecorreo = await getDocenteByCorreo(correo);
      const isDocentecedual = await getCedulaDocente(cedula);
      if (isDocentecorreo || isDocentecedual) {
        return res.status(409).json({
          message: "El docente con esta cédula o correo ya existe.",
          status: "ok",
        });
      } else {
        return res.status(409).json({
          message:
            "El correo o cédula ya está registrado pero NO es un DOCENTE.",
          status: "ok",
        });
      }
    }

    //antes de crear el user haseamos la password
    const hashedPassword = await bcrypt.hash(contrasena, SALTROUNDS);

    await connection.beginTransaction();
    const formatData = {
      nombre,
      apellido,
      correo,
      cedula,
      contrasena: hashedPassword,
    };

    let result = await connection.query(
      "INSERT INTO persona SET ?",
      formatData
    );

    if (result.affectedRows > 0) {
      const { insertId } = result;
      result = await connection.query(
        "INSERT INTO docente (persona) VALUES (" + insertId + ")"
      );
      await connection.commit();

      return res.status(200).json({
        status: "ok",
        message: "Datos almacenados en la base de datos correctamente",
      });
    } else {
      throw new Error("No se pudo insertar el registro.");
    }
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error("Error en la transacción:", error.message);
    if (!res.headersSent) {
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Error en la operación: " + error.message,
      });
    }
  }
};

/* Este metodo actualiza los registros de la tabla docente si el parametro coincide con la cedula*/
const updateDocente = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    if (req.params !== undefined) {
      const { cedula } = req.params;
      if (req.body !== undefined) {
        const [result] = await connection.query(
          "UPDATE persona SET ? WHERE cedula = ?",
          [req.body, cedula]
        );

        const { affectedRows } = result;
        if (affectedRows > 0) {
          res.status(200).json({
            status: "ok",
            message: "Datos actualizados correctamente.",
          });
        } else {
          res.status(400).json({
            status: "bad request",
            message: "No se encontro la cedula en los registros.",
          });
        }

        return;
      }
      res.status(400).send("Bad Request: Body no definido.");
    }
    res.status(400).send("Bad Request: Parámetros no definidos.");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo elimina un registro de la tabla docente siempre y cuando el parametro coincida con la cedula */
const deleteDocente = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;

      const selectedPerosna = await connection.query(
        `SELECT id FROM persona WHERE cedula = ?`,
        [cedula]
      );
      const idpersona = selectedPerosna[0].id;
      // Primero eliminamos las relaciones
      await connection.query(
        "DELETE reporte FROM reporte JOIN clase ON reporte.clase = clase.id JOIN horario ON clase.horario = horario.id JOIN docente ON horario.docente = docente.id JOIN persona ON docente.persona = persona.id WHERE persona.cedula = ?",
        [cedula]
      );

      await connection.query(
        "DELETE comentario FROM comentario JOIN clase ON comentario.clase = clase.id JOIN horario ON clase.horario = horario.id JOIN docente ON horario.docente = docente.id JOIN persona ON docente.persona = persona.id WHERE persona.cedula = ?",
        [cedula]
      );

      await connection.query(
        "DELETE clase FROM clase JOIN horario ON horario.id = clase.horario JOIN docente ON horario.docente = docente.id JOIN persona ON docente.persona = persona.id WHERE persona.cedula = ?",
        [cedula]
      );

      await connection.query(
        "DELETE detalle_horario FROM detalle_horario JOIN horario ON detalle_horario.horario = horario.id JOIN docente ON horario.docente = docente.id JOIN persona ON docente.persona = persona.id WHERE persona.cedula = ?",
        [cedula]
      );

      await connection.query(
        "DELETE horario FROM horario JOIN docente ON horario.docente = docente.id JOIN persona ON docente.persona = persona.id WHERE persona.cedula = ?",
        [cedula]
      );
      try {
        await connection.query(
          `DELETE FROM notificacion
  WHERE id IN (
      SELECT notificacion.id
      FROM notificacion
      JOIN docente ON docente.persona = notificacion.de OR docente.persona = notificacion.para
      JOIN persona ON docente.persona = persona.id
      WHERE persona.id = ?)
  `,
          [idpersona]
        );
      } catch (error) {
        throw new Error("No found teacher in the database");
      }
      // Primero eliminamos el docente
      await connection.query(
        "DELETE docente FROM docente JOIN persona ON persona.id = docente.persona WHERE persona.cedula = ?",
        [cedula]
      );

      // Finalmente eliminamos la persona
      await connection.query(
        "DELETE persona FROM persona WHERE persona.cedula = ?",
        [cedula]
      );

      // Si todo ha ido bien, respondemos
      res.status(200).json({
        status: "ok",
        message: "Datos eliminados de la base de datos.",
      });

      return;
    }
    res.status(400).send("Bad Request.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo retorna la suma de los registros en la tabla docente */
const countDocente = async (req, res) => {
  const [result] = await connection.query("SELECT COUNT(*) FROM docente");
  res.json(result[0]("COUNT(*)"));
};

/* Aqui exportamos todos los metodos previamente creados para luego usarlos en las rutas*/

export const methods = {
  getDocentes,
  getDocenteIdByCedula,
  getDocenteByCedula,
  saveDocente,
  updateDocente,
  deleteDocente,
  countDocente,
  getCedulaDocente,
};

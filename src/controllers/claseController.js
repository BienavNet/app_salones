import { DatesYYYYMMDD } from "../assets/function.js";
import { connection } from "./../database/database.js";

/* Documento controlador para la tabla Clase */

/* Este metodo obtiene todas las clases que se encuentran almacenadas en la base de datos*/
const getClases = async (req, res) => {
  try {
    const [result] = await connection.query(
      `
      SELECT 
      clase.id, clase.fecha, horario.asignatura, persona.apellido AS docente_apellido, persona.nombre AS docente_nombre, salon.numero_salon  
      FROM clase
      JOIN horario ON clase.horario = horario.id
      JOIN salon ON clase.salon = salon.id
      JOIN docente ON horario.docente = docente.id
      JOIN persona ON docente.persona = persona.id  
      `
    );

    if (result.length > 0) {
      res.status(200).json(result);
      return;
    }
    res.status(404).json({ status: "error", message: "not found class." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo obtiene todas las clases que se encuentran almacenadas en la base de datos, siempre y cuando coincida con el ID de la tabla horario*/
const getClassHorarioId = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing id." });

    const [result] = await connection.query(
      "SELECT id, horario FROM clase WHERE horario = ?",
      [id]
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "No data found." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error: " + error.message,
    });
  }
};

/* Este metodo obtiene todas las clases que se encuentran almacenadas en la base de datos, siempre y cuando coincida con el ID de la tabla clase*/
const getIdClase = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing id." });

    const [result] = await connection.query(
      "SELECT clase.* FROM clase WHERE clase.id = ?",
      [id]
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "No data found." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error: " + error.message,
    });
  }
};

/* Este metodo obtiene todas las clases que se encuentran almacenadas en la base de datos, siempre y cuando coincida con el ID de la tabla horario*/
const getClaseByHorario = async (req, res) => {
  try {
    const { horario } = req.params;
    if (!horario)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing horario." });

    const [result] = await connection.query(
      "SELECT clase.* FROM clase WHERE clase.horario = ?",
      [horario]
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "No data found." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error: " + error.message,
    });
  }
};

/* Este metodo obtiene todas las clases que se encuentran almacenadas en la base de datos, siempre y cuando coincida con el nombre de la tabla salon*/
const getClaseBySalon = async (req, res) => {
  try {
    const { salon } = req.params;
    if (!salon)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing salon." });

    const [result] = await connection.query(
      "SELECT clase.* FROM clase WHERE clase.salon = ?",
      [salon]
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "No data found." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error: " + error.message,
    });
  }
};

/* Este metodo obtiene todas las clases que se encuentran almacenadas en la base de datos, siempre y cuando coincida con la CEDULA de la tabla supervisor*/
const getClaseBySupervisor = async (req, res) => {
  try {
    const { cedula } = req.params;
    if (!cedula)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing cedula." });

    const [result] = await connection.query(
      `SELECT clase.*, salon.nombre AS nombre_salon, salon.numero_salon, categoria_salon.categoria, 
      docente_persona.nombre AS nombre_docente, docente_persona.apellido AS apellido_docente, 
      detalle_horario.hora_inicio, detalle_horario.hora_fin, horario.asignatura, reporte.comentario
      FROM clase
      JOIN supervisor ON supervisor.id = clase.supervisor
      JOIN persona AS supervisor_persona ON supervisor_persona.id = supervisor.persona
      JOIN salon ON salon.id = clase.salon
      JOIN categoria_salon ON salon.categoria_salon = categoria_salon.id
      JOIN horario ON horario.id = clase.horario
      JOIN detalle_horario ON detalle_horario.horario = horario.id
      LEFT JOIN reporte ON reporte.clase = clase.id 
      JOIN docente ON docente.id = horario.docente
      JOIN persona AS docente_persona ON docente_persona.id = docente.persona
      WHERE supervisor_persona.cedula = ?`,
      [cedula]
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({ status: "error", message: "No data found." });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server Error: " + error.message,
    });
  }
};

/* Este metodo registra una nueva clase */

const registerClase = async (req, res) => {
  try {
    const { horario, salon, supervisor, estado, fecha } = req.body;
    if (!horario || !salon || !supervisor || !estado || !fecha) {
      return res.status(400).json({
        status: "error",
        message: "Bad Request: Missing required fields.",
      });
    }

    const [result] = await connection.query(
      "INSERT INTO clase SET ?",
      req.body
    );
    const { affectedRows } = result;

    if (affectedRows == 1) {
      return res.status(200).json({
        status: "ok",
        message: "Datos almacenados correctamente en el servidor.",
      });
    }

    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo elimina una clase previamente creada, siempre y cuando el ID pasado, sea el mismo ID de la tabla clase */
const deleteClase = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing id." });

    const [result1] = await connection.query(
      "DELETE FROM reporte WHERE reporte.clase = ?",
      [id]
    );

    const [result2] = await connection.query(
      "DELETE FROM comentario WHERE comentario.clase = ?",
      [id]
    );

    const [result] = await connection.query(
      "DELETE FROM clase WHERE clase.id = ?",
      [id]
    );

    const { affectedRows } = result;
    if (affectedRows == 1) {
      return res.status(200).json({
        status: "ok",
        message: "Datos eliminados correctamente en el servidor.",
      });
    }

    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo actualiza cualquier valor menos el id de una clase, siempre y cuando el ID pasado sea el mismo de la tabla clase */

const updateClase = async (req, res) => {
  // fecha, supervisor, dia, salon
  try {
    if (req.params !== undefined && req.body !== undefined) {
      const { id } = req.params;
      const [result] = await connection.query(
        "UPDATE clase SET ? WHERE clase.id = " + id + ""
      );
      const { affectedRows } = result;

      if (affectedRows == 1) {
        res.status(200).json({
          status: "ok",
          message: "Datos actualizados correctamente en el servidor.",
        });
        return;
      }
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo es un filtro, que obtiene los valores dependiendo del parametro pasado. Puede ser la cedula del supervisor, el nombre del salon, el dia o el id del horario */
const filterBySupSalDiaHor = async (req, res) => {
  try {
    const { cedula, salon, dia, horario } = req.params;
    if (!cedula)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing cedula." });
    let query = `
      SELECT clase.*, 
             salon.numero_salon, 
             categoria_salon.categoria, 
             docente_persona.nombre AS nombre_docente, 
             docente_persona.apellido AS apellido_docente, 
             detalle_horario.hora_inicio, 
             detalle_horario.hora_fin, 
             horario.asignatura
      FROM clase 
      JOIN supervisor ON clase.supervisor = supervisor.id
      JOIN persona AS supervisor_persona ON supervisor_persona.id = supervisor.persona
      JOIN salon ON salon.id = clase.salon
      JOIN categoria_salon ON categoria_salon.id = salon.categoria_salon
      JOIN horario ON horario.id = clase.horario
      JOIN detalle_horario ON detalle_horario.horario = horario.id
      JOIN docente ON docente.id = horario.docente
      JOIN persona AS docente_persona ON docente_persona.id = docente.persona
      WHERE supervisor_persona.cedula = ${cedula}
    `;

    // Filtros dinámicos
    if (salon != 0) {
      query += ` AND clase.salon = ${salon}`;
    }
    if (dia != 0) {
      query += ` AND detalle_horario.dia = '${dia}'`;
    }
    if (horario != 0) {
      query += ` AND clase.horario = ${horario}`;
    }

    const [result] = await connection.query(query);

    if (result.length > 0) {
      res.status(200).json(result);
      return;
    } else {
      return res.status(200).json({
        status: "success",
        message: "No se encontró información para los filtros seleccionados.",
        result: [],
      });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo es un filtro que obtiene los datos de la clase a partir de la cedula del Docente */

const filterByDoc = async (req, res) => {
  try {
    const { cedula } = req.params;
    if (!cedula)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing cedula." });

    const [result] = await connection.query(
      `SELECT clase.fecha, clase.id as clase_id, horario.asignatura, detalle_horario.hora_inicio, detalle_horario.hora_fin, salon.numero_salon, salon.id as salon_id, docente.id as id_docente,
       comentario.id AS comentario_id, comentario.comentario,  
    comentario.fecha AS comentario_fecha
      FROM clase JOIN horario ON clase.horario = horario.id JOIN docente ON horario.docente = docente.id JOIN persona ON docente.persona = persona.id JOIN detalle_horario ON horario.id = detalle_horario.horario 
      JOIN salon ON clase.salon = salon.id 
      LEFT JOIN comentario ON comentario.clase = clase.id 
      WHERE persona.cedula = ${cedula}`
    );

    if (result.length > 0) {
      const transformedResult = result.map((item) => {
        const formattedDate = DatesYYYYMMDD(item.fecha);
        return {
          ...item,
          fecha: formattedDate,
        };
      });
      return res.status(200).json(transformedResult);
    }

    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo es un filtro que obtiene los datos a partir del parametro fecha */

const filterByDate = async (req, res) => {
  try {
    const { fecha, cedula } = req.params;
    if (!fecha || !cedula) {
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing parameters." });
    }
    const [result] = await connection.query(
      "SELECT clase.* FROM clase JOIN horario ON horario.id = clase.horario JOIN docente ON docente.id = horario.docente JOIN persona ON persona.id = docente.persona WHERE clase.fecha = ? AND persona.cedula = ?",
      [fecha, cedula]
    );
    if (result && result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({
        status: "error",
        message: "No data found for the given date and cedula.",
      });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

export const methods = {
  getClases,
  getClaseByHorario,
  getClaseBySalon,
  getClaseBySupervisor,
  registerClase,
  deleteClase,
  updateClase,
  getIdClase,
  getClassHorarioId,
  filterBySupSalDiaHor,
  filterByDoc,
  filterByDate,
};

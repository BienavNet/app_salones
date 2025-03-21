import { DatesYYYYMMDD } from "../assets/function.js";
import { connection } from "./../database/database.js";

/// Almacena un nuevo registro de la tabla horario en la base de datos
const saveHorario = async (req, res) => {
  if (!req.body && req.body != undefined && req.body !== "")
    res.status(400).send("Bad Request.");
  try {
    res.setHeader("Content-Type", "application/json");
    const { docente, asignatura } = req.body;

    if (typeof docente === "number" && typeof asignatura === "string") {
      const [result] = await connection.query(
        "INSERT INTO horario SET ?",
        req.body
      );
      const { insertId, affectedRows } = result;

      if (affectedRows === 1) {
        return res.status(200).json({
          status: "ok",
          message: "Horario almacenado correctamente.",
          id: insertId,
        });
      } else {
        return res.status(400).json({
          status: "error",
          message: "No se pudo almacenar el horario.",
        });
      }
    }
    return res.status(400).json({
      status: "error",
      message: "Los datos enviados no poseen el formato correcto.",
    });

    // if (req.body != undefined && req.body !== ""){

    // }
    // return res.status(400).json({
    //     "status": "error",
    //     "message": "Los datos a almacenar no pueden estar vacíos."
    // });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Actualiza un registro pre existente de la tabla horario si el id pasado coincide con el almacenado
const updateHorario = async (req, res) => {
  try {
    if (req.body !== undefined && req.body !== "") {
      if (req.params !== undefined) {
        const { id } = req.params;
        if (req.body !== undefined) {
          const [result] = await connection.query(
            "UPDATE horario SET ? WHERE id = " + id + "",
            req.body
          );
          const { affectedRows } = result;

          if (affectedRows == 1) {
            return res.status(200).json({
              status: "ok",
              message: "Datos actualizados correctamente.",
            });
          }
          return res.status(200).json({
            status: "error",
            message: "Error en los datos enviados al servidor.",
          });
        }

        res.status(400).send("Bad request.");
      }
    }
    res.status(400).send("Bad request.");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Elimina un registro preexistente de la tabla horario si el id pasado coincide con el almacenado
const deleteHorario = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;

      const [query1] = await connection.query(
        "DELETE detalle_horario FROM detalle_horario WHERE detalle_horario.horario = ?",
        [id]
      );

      const [result] = await connection.query(
        "DELETE FROM horario WHERE id = " + id + ""
      );
      const { affectedRows } = result;

      if (affectedRows > 0) {
        return res.status(200).json({
          status: "ok",
          message: "Datos eliminados de la base de datos.",
        });
      } else {
        return res.status(400).json({
          status: "bad request",
          message: "No se encontro el horario en los registros.",
        });
      }
    }
    return res.status(400).send("Bad Request.");
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};
const deleteHorarioAll = async (req, res) => {
  try {
    await connection.query("DELETE FROM detalle_horario");
    const [result] = await connection.query("DELETE FROM horario");
    const { affectedRows } = result;

    if (affectedRows > 0) {
      return res.status(200).json({
        status: "ok",
        message: "Todos los datos han sido eliminados de la base de datos.",
      });
    } else {
      return res.status(400).json({
        status: "bad request",
        message: "No se encontraron registros para eliminar.",
      });
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/// Obtiene el horario de los docentes por medio de la cedula.
const getHorarios = async (req, res) => {
  try {
    const [result] = await connection.query(
      "SELECT horario.id, horario.asignatura, detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin, persona.nombre, persona.apellido, persona.cedula FROM horario JOIN docente ON horario.docente = docente.id JOIN detalle_horario ON horario.id = detalle_horario.horario JOIN persona ON docente.persona = persona.id"
    );
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    res.status(404).json({
      status: "error",
      message: "not found schedules.",
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/// Obtiene un horario en especifico si el id pasado coincide con alguno que se encuentre registrado en la base de datos.
const getHorarioById = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;
      const [result] = await connection.query(
        `
        SELECT 
    horario.id, 
    horario.asignatura,
    detalle_horario.id AS id_detallehorario, 
    detalle_horario.dia, 
    detalle_horario.hora_inicio, 
    detalle_horario.hora_fin, 
    persona.nombre AS nombre_docente, 
    persona.apellido AS apellido_docente, 
    persona.cedula, 
    docente.id AS docente_id, 
    clase.salon, 
    clase.estado, 
    clase.fecha, 
    clase.id AS id_class, 
    salon.nombre, 
    salon.numero_salon 
FROM horario 
JOIN detalle_horario ON horario.id = detalle_horario.horario 
JOIN docente ON horario.docente = docente.id 
JOIN persona ON docente.persona = persona.id 
LEFT JOIN clase ON horario.id = clase.horario
LEFT JOIN salon ON clase.salon = salon.id
LEFT JOIN categoria_salon ON salon.categoria_salon = categoria_salon.id 
WHERE horario.id = ?`,
        [id]
      );
      const JOINHORARIODATA = result.reduce((a, row) => {
        const {
          id_class,
          id,
          docente_id,
          cedula,
          nombre_docente,
          apellido_docente,
          asignatura,
          dia,
          fecha,
          hora_inicio,
          hora_fin,
          numero_salon,
          estado,
          id_detallehorario,
        } = row;

        const dateforma = DatesYYYYMMDD(fecha);

        if (!a[cedula]) {
          a[cedula] = {
            id,
            cedula,
            docente_id,
            nombre: nombre_docente,
            apellido: apellido_docente,
            asignatura,
            horarios: [],
          };
        }
        a[cedula].horarios.push({
          id_class,
          dia,
          estado,
          fecha: dateforma,
          hora_inicio,
          hora_fin,
          numero_salon,
          id_detallehorario,
        });
        return a;
      }, {});

      const resultArray = Object.values(JOINHORARIODATA);
      if (resultArray.length > 0) {
        return res.status(200).json(resultArray);
      } else {
        return res
          .status(404)
          .json({ status: "error", message: "No records found." });
      }
    }
    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/// Obtiene el horario de los docentes por medio de la cedula.
const getHorariosByDocente = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;
      const [result] = await connection.query(
        "SELECT DISTINCT horario.*, detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin, salon.nombre, salon.numero_salon FROM horario JOIN clase ON clase.horario = horario.id JOIN salon ON clase.salon = salon.id JOIN detalle_horario ON detalle_horario.horario = horario.id JOIN docente ON docente.id = horario.docente JOIN persona ON docente.persona = persona.id WHERE persona.cedula = " +
          cedula +
          ""
      );
      return res.status(200).json(result);
    }
    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

export const methods = {
  saveHorario,
  updateHorario,
  deleteHorario,
  getHorarios,
  getHorarioById,
  getHorariosByDocente,
  deleteHorarioAll,
};

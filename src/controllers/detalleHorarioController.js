import { connection } from "./../database/database.js";

/* Este metodo obtiene todos los registros de la tabla detallehorario siempre y cuando los parametos coincidan con el id de la tabla */

const getDetalleHorariosByHorarioId = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;
      const [result] = await connection.query(
        "SELECT id, horario FROM detalle_horario WHERE horario = " + id + ""
      );
      if (result.length > 0) {
        res.status(200).json(result);
        return;
      }
      res.status(200).json({
        status: "error",
        message: "No se obtuvo ningun dato desde el servidor.",
      });
      return;
    }
    res.status(400).json({ status: "error", message: "Bad Request." });
    return;
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo obtiene todos los registros de la tabla detallehorario siempre y cuando los parametos coincidan con el id de la tabla */

const getDetalleHorarioById = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;
      const [result] = await connection.query(
        `SELECT detalle_horario.*, clase.salon, salon.numero_salon
         FROM detalle_horario 
         jOIN horario ON detalle_horario.horario = horario.id
         JOIN clase ON horario.id = clase.horario
         JOIN salon ON clase.salon = salon.id
         WHERE detalle_horario.horario = ?`,
        [id]
      );
      if (result.length > 0) {
        return res.status(200).json(result);
      }
      return res.status(404).json({
        status: "error",
        message: "No se obtuvo ningun dato desde el servidor.",
      });
    }
    return res.status(400).json({ status: "error", message: "Bad Request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Esta metodo obtiene todos los registros de la tabla siempre y cuando el parametro coincida con la cedula del docente */

const getDetallesHorarioByDocente = async (req, res) => {
  try {
    if (req.params != undefined) {
      const { cedula } = req.params;
      const [result] = await connection.query(
        `SELECT detalle_horario.dia, 
       MIN(horario.id) AS id,
       horario.asignatura, 
       persona.nombre, 
       persona.apellido
FROM detalle_horario 
JOIN horario ON horario.id = detalle_horario.horario 
JOIN docente ON docente.id = horario.docente 
JOIN persona ON docente.persona = persona.id 
WHERE persona.cedula = ?
GROUP BY detalle_horario.dia, 
         horario.asignatura, 
         persona.nombre, 
         persona.apellido;`,
        [cedula]
      );

      if (result.length > 0) {
        return res.status(200).json(result);
      }
      return res.status(404).json({
        status: "error",
        message: "No se obtuvo ningun dato desde el servidor.",
      });
    }
    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Esta metodo obtiene todos los registros de la tabla siempre y cuando el parametro coincida con el id del horario */

const getDetallesHorariosByHorario = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { horario } = req.params;
      const [result] = await connection.query(
        `
     SELECT detalle_horario.dia, 
       horario.id,
       horario.asignatura, 
       persona.nombre, 
       persona.apellido, 
       MIN(clase.id) AS id_class, 
       MIN(clase.fecha) AS fecha, 
       categoria_salon.categoria, 
       salon.numero_salon, 
       salon.nombre AS nombre_salon
FROM detalle_horario 
JOIN horario ON horario.id = detalle_horario.horario 
JOIN docente ON docente.id = horario.docente 
JOIN persona ON docente.persona = persona.id 
JOIN clase ON clase.horario = horario.id 
JOIN salon ON clase.salon = salon.id 
JOIN categoria_salon ON salon.categoria_salon = categoria_salon.id 
WHERE horario.id = ? 
GROUP BY detalle_horario.dia, 
         horario.asignatura, 
         persona.nombre, 
         persona.apellido, 
         categoria_salon.categoria, 
         salon.numero_salon, 
         salon.nombre;`,
        [horario]
      );

      if (result.length > 0) {
        return res.status(200).json(result);
      }

      return res.status(404).json({
        status: "error",
        message: "No se obtuvo ningun dato desde el servidor.",
      });
    }
    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo obtiene todos los registros de la tabla */

const getAllDetallesHorario = async (req, res) => {
  try {
    const [result] = await connection.query("SELECT * FROM detalle_horario");

    if (result.length > 0) {
      res.status(200).json(result);
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo almacena nuevos registros en la tabla */

const saveDetalleHorario = async (req, res) => {
  try {
    if (req.body !== undefined) {
      const { horario, dia, hora_inicio, hora_fin } = req.body;

      if (
        horario !== undefined &&
        dia !== undefined &&
        hora_inicio !== undefined &&
        hora_fin !== undefined
      ) {
        const [result] = await connection.query(
          "INSERT INTO detalle_horario SET ?",
          req.body
        );
        const { insertId, affectedRows } = result;

        if (affectedRows == 1) {
          return res.status(200).json({
            status: "ok",
            id: insertId,
            message: "Datos almacenados correctamente",
          });
        }
        return res
          .status(400)
          .json({ status: "error", message: "Bad request." });
      }
      return res.status(400).json({ status: "error", message: "Bad request." });
    }
    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo elimina un registro de la tabla siempre y cuando el parametro coincida con el id */

const deleteDetalleHorario = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;

      const [result] = await connection.query(
        "DELETE FROM detalle_horario WHERE id = " + id + ""
      );

      const { affectedRows } = result;

      if (affectedRows == 1) {
        res.status(200).json({
          status: "ok",
          message: "Registros eliminados exitosamente.",
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

/* Este metodo actualiza cualquier registro de la tabla siempre y cuando el parametro coincida con el id  */

const updateDetalleHorario = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!id || !data || Object.keys(data).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Bad request: ID o datos faltantes.",
      });
    }
    const [result] = await connection.query(
      `UPDATE detalle_horario SET ? WHERE id = ?`,
      [data, id]
    );
    if (result.affectedRows === 1) {
      return res.status(200).json({
        status: "ok",
        message: "Datos actualizados correctamente.",
      });
    }
    return res.status(404).json({
      status: "error",
      message:
        "No se encontraron datos para actualizar con el ID proporcionado.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor: " + error.message,
    });
  }
};


const updateDetalleHorarioByHorarioId = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    if (!id || !data || Object.keys(data).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Bad request: ID o datos faltantes.",
      });
    }
    const [result] = await connection.query(
      `UPDATE detalle_horario SET ? WHERE detalle_horario.horario = ?`,
      [data, id]
    );
    if (result.affectedRows === 1) {
      return res.status(200).json({
        status: "ok",
        message: "Datos actualizados correctamente.",
      });
    }
    return res.status(404).json({
      status: "error",
      message:
        "No se encontraron datos para actualizar con el ID proporcionado.",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Error interno del servidor: " + error.message,
    });
  }
};
/* Este metodo filtra los registros de la tabla y devuelve los que coinciden con el parametro dia */

const filterByDay = async (req, res) => {
  try {
    const { dia, cedula } = req.params;
    if (!dia || !cedula) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing required parameters." });
    }
    const [result] = await connection.query(
      `SELECT detalle_horario.dia, 
       detalle_horario.hora_inicio, 
       detalle_horario.hora_fin,
       horario.id, 
       horario.asignatura, 
       persona.nombre, 
       persona.apellido, 
       MIN(clase.id) AS id_class,
       MIN(clase.fecha) AS fecha, 
       categoria_salon.categoria, 
       salon.numero_salon, 
       salon.nombre AS nombre_salon
FROM detalle_horario
JOIN horario ON horario.id = detalle_horario.horario
JOIN docente ON docente.id = horario.docente
JOIN persona ON docente.persona = persona.id
JOIN clase ON clase.horario = horario.id
JOIN salon ON clase.salon = salon.id
JOIN categoria_salon ON salon.categoria_salon = categoria_salon.id
WHERE detalle_horario.dia = ? 
  AND persona.cedula = ?
GROUP BY detalle_horario.dia, 
         detalle_horario.hora_inicio, 
         detalle_horario.hora_fin, 
         horario.asignatura, 
         persona.nombre, 
         persona.apellido, 
         categoria_salon.categoria, 
         salon.numero_salon, 
         salon.nombre;
`,
      [dia, cedula]
    );
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "No records found." });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Aqui exportamos todos los metodos previamente creados para luego usarlos en las rutas*/

export const methods = {
  getDetalleHorarioById,
  getDetallesHorarioByDocente,
  getDetallesHorariosByHorario,
  getAllDetallesHorario,
  saveDetalleHorario,
  deleteDetalleHorario,
  updateDetalleHorario,
  updateDetalleHorarioByHorarioId,
  getDetalleHorariosByHorarioId,
  filterByDay,
};

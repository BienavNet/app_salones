import { connection } from "./../database/database.js";

/* Este metodo obtiene los datos de comentario, siempre y cuando el parametro pasado coincida con el ID de la tabla comentario. */

const getComentarioById = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;

      const [result] = await connection.query(
        `SELECT comentario.*, 
salon.nombre AS salon_nombre, 
salon.numero_salon, 
persona.nombre, 
persona.apellido
FROM comentario 
JOIN docente ON comentario.docente = docente.id
JOIN persona ON persona.id = docente.persona
JOIN salon ON salon.id = comentario.salon
WHERE comentario.id = ?`,
        [id]
      );
      if (result.length > 0) {
        res.status(200).json(result);
        return;
      }
      res.status(404).json({ status: "error", message: "Bad not found.." });
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
// ✅

/* Este metodo obtiene los datos de comentario, siempre y cuando el parametro pasado coincida con la CEDULA de la tabla docente. */

const getComentarioByDocente = async (req, res) => {
  try {
    const { cedula } = req.params;
    if (!cedula || cedula.trim() === "") {
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing cedula." });
    }

    const [result] = await connection.query(
      `
        SELECT comentario.*, persona.nombre, salon.nombre AS nombre_salon, salon.numero_salon
        FROM comentario 
        JOIN salon on salon.id = comentario.salon 
        JOIN docente ON docente.id = comentario.docente 
        JOIN persona ON persona.id = docente.persona 
        WHERE persona.cedula = ? `,
      [cedula]
    );
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    return res
      .status(404)
      .json({ status: "error", message: "Teacher's comment not found." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo obtiene los datos de comentario, siempre y cuando el parametro pasado coincida con el ID de la tabla salon. */

const getComentarioBySalon = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { salon } = req.params;

      const [result] = await connection.query(
        `
SELECT comentario.*, salon.nombre AS nombre_salon, salon.numero_salon, persona.nombre, persona.apellido
FROM comentario 
JOIN salon on salon.id = comentario.salon 
JOIN docente ON docente.id = comentario.docente 
JOIN persona ON persona.id = docente.persona 
WHERE salon.id = ?`,
        [salon]
      );

      if (result.length > 0) {
        res.status(200).json(result);
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

/* Este metodo obtiene todos registros de la tabla comentarios. */
const getAllComentarios = async (req, res) => {
  try {
    const [result] = await connection.query(`
SELECT comentario.*, 
    salon.nombre AS salon_nombre, 
    salon.numero_salon, 
    persona.nombre, 
    persona.apellido 
FROM 
    comentario 
JOIN 
    docente ON comentario.docente = docente.id
JOIN 
    persona ON persona.id = docente.persona
JOIN 
    salon ON salon.id = comentario.salon;`);

    if (result.length > 0) {
      res.status(200).json(result);
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/* Este metodo permite registrar nuevos registros en la tabla comentarios. */
const registerComentario = async (req, res) => {
  try {
    if (req.body !== undefined) {
      const { comentario, docente, salon, fecha, clase } = req.body;
      if (
        comentario !== undefined &&
        docente !== undefined &&
        salon !== undefined &&
        fecha !== undefined &&
        clase !== undefined
      ) {
        const [result] = await connection.query(
          `INSERT INTO comentario (comentario, docente, salon, fecha, clase) VALUES (?, ?, ?, ?, ?)`,
          [comentario, docente, salon, fecha, clase]
        );
        const { insertId, affectedRows } = result;
        if (affectedRows == 1 && insertId !== undefined) {
          res.status(200).json({
            status: "ok",
            id: insertId,
            message: "Datos almacenados correctamente",
          });
          return;
        }
        res.status(400).json({ status: "error", message: "Bad request." });
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

/* Este metodo permite eliminar registros almacenados en la tabla comentarios. */

const deleteComentarioById = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;

      const [result] = await connection.query(
        `
        DELETE FROM comentario WHERE id = ?`,
        [id]
      );

      const { affectedRows } = result;

      if (affectedRows > 0) {
        res
          .status(200)
          .json({ status: "ok", message: "Datos eliminados del servidor." });
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

/* Este metodo permite eliminar todas las concurrencias de los registros almacenados en la tabla comentarios, siempre y cuando coincida el parametro pasado con la cedula del docente. */

const deleteAllComentariosByDocente = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;

      const [result] = await connection.query(
        "DELETE comentario FROM comentario JOIN docente ON docente.id = comentario.docente JOIN persona ON docente.persona = persona.id WHERE persona.cedula = " +
          cedula +
          ""
      );

      const { affectedRows } = result;

      if (affectedRows == 1) {
        res
          .status(200)
          .json({ status: "ok", message: "Datos eliminados del servidor." });
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

/* Este metodo filtra los registros de la tabla comentario con los parametros: cedula del docente o id del salon */

const filterByDocAndSal = async (req, res) => {
  try {
    if (!req.params) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing parameters." });
    }
    const { cedula, salon } = req.params;
    if (cedula == 0 && salon == 0) {
      return res
        .status(400)
        .json({
          status: "error",
          message: "At least one parameter must be provided.",
        });
    }
    let query = `
      SELECT comentario.*, salon.numero_salon, salon.nombre as nombre_salon, categoria_salon.categoria
      FROM comentario 
      JOIN salon ON comentario.salon = salon.id
      JOIN categoria_salon ON salon.categoria_salon = categoria_salon.id
      JOIN docente ON comentario.docente = docente.id 
      JOIN persona ON docente.persona = persona.id
    `;
    const conditions = [];
    const params = [];

    if (cedula != 0) {
      conditions.push("persona.cedula = ?");
      params.push(cedula);
    }
    if (salon != 0) {
      conditions.push("comentario.salon = ?");
      params.push(salon);
    }
    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }
    const [result] = await connection.query(query, params);
    if (result.length > 0) {
      return res.status(200).json(result);
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "No comments found." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({
        status: "error",
        message: "Internal Server Error: " + error.message,
      });
  }
};

/* Aqui exportamos todos los metodos previamente creados para luego usarlos en las rutas*/

export const methods = {
  getComentarioById,
  getComentarioByDocente,
  getComentarioBySalon,
  getAllComentarios,
  registerComentario,
  deleteComentarioById,
  deleteAllComentariosByDocente,
  filterByDocAndSal,
};

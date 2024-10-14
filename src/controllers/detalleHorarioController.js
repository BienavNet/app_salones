import { connection } from "./../database/database.js";

/* Este metodo obtiene todos los registros de la tabla detallehorario siempre y cuando los parametos coincidan con el id de la tabla */

const getDetalleHorariosByHorarioId = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;
      console.log("id entrando", id);
      
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
      console.log("id detalle_horario", id);
      
      const [result] = await connection.query(
        `SELECT detalle_horario.*, clase.salon, salon.numero_salon
         FROM detalle_horario 
         jOIN horario ON detalle_horario.horario = horario.id
         JOIN clase ON horario.id = clase.horario
         JOIN salon ON clase.salon = salon.id
         WHERE detalle_horario.horario = ?`,[id]);
         console.log("result de detalle_horario", result);
      if (result.length > 0) {
        return res.status(200).json(result);
      }
      return res.status(200).json({
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
        "SELECT detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin, horario.id as horario, horario.asignatura FROM detalle_horario JOIN horario ON horario.id = detalle_horario.horario JOIN docente ON docente.id = horario.docente JOIN persona ON docente.persona = persona.id WHERE persona.cedula = " +
          cedula +
          ""
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

    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};


/* Esta metodo obtiene todos los registros de la tabla siempre y cuando el parametro coincida con el id del horario */

const getDetallesHorariosByHorario = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { asignatura } = req.params;
      
      const [result] = await connection.query(
        "SELECT detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin, horario.asignatura FROM detalle_horario JOIN horario ON horario.id = detalle_horario.horario WHERE horario.id = " +
          asignatura +
          ""
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
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
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
    if (req.params !== undefined && req.body !== undefined) {
      const { id } = req.params;

      if (id !== undefined) {
        
        const [result] = await connection.query(
          "UPDATE detalle_horario SET ? WHERE id = " + id + "",
          req.body
        );

        const { affectedRows } = result;

        if (affectedRows == 1) {
          res.status(200).json({
            status: "ok",
            message: "Datos actualizados correctamente.",
          });
          return;
        }
        res.status(400).json({
          status: "error",
          message: "No se pudieron actualizar los datos.",
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

/* Este metodo filtra los registros de la tabla y devuelve los que coinciden con el parametro dia */

const filterByDay = async (req, res) => {
  try {
    if (req.params!== undefined){
      const {dia, cedula} = req.params
      const connection = await database.getConnection()
      const [result] = await connection.query("SELECT detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin, horario.asignatura FROM detalle horario JOIN horario ON horario.id = detalle_horario.horario JOIN persona ON docente.persona = persona.id WHERE detalle_horario.dia = " +dia+ " AND persona.cedula = " +cedula+ " ")
      
      if (result.length > 0) {
        res.status(200).json(result);
        return;
      }
      res.status(400).json({ status: "error", message: "Bad request." });
    }
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
}


/* Aqui exportamos todos los metodos previamente creados para luego usarlos en las rutas*/

export const methods = {
  getDetalleHorarioById,
  getDetallesHorarioByDocente,
  getDetallesHorariosByHorario,
  getAllDetallesHorario,
  saveDetalleHorario,
  deleteDetalleHorario,
  updateDetalleHorario,
  getDetalleHorariosByHorarioId,
  filterByDay
};

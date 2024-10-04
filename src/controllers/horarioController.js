import { connection } from "./../database/database.js";

// ✅
const saveHorario = async (req, res) => {
  if (!req.body && req.body != undefined && req.body !== "")
    res.status(400).send("Bad Request.");
  try {
    res.setHeader("Content-Type", "application/json");
    const { docente, asignatura } = req.body;

    if (typeof docente === "number" && typeof asignatura === "string") {
      
      const result = await connection.query(
        "INSERT INTO horario SET ?",
        req.body
      );
      console.log(result);

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

const updateHorario = async (req, res) => {
  try {
    if (req.body !== undefined && req.body !== "") {
      if (req.params !== undefined) {
        const { id } = req.params;
        console.log("id: " + id);
        if (req.body !== undefined) {
          
          const result = await connection.query(
            "UPDATE horario SET ? WHERE id = " + id + "",
            req.body
          );
          console.log("result: " + result);
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

const deleteHorario = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;
      console.log(`deleting  ${id}`);
      
      // DELETE horario, detalle_horario, clase FROM horario JOIN detalle_horario ON horario.id = detalle_horario.horario JOIN clase ON horario.id = clase.horario WHERE horario.id = " +id+ ""
      const result = await connection.query(
        "DELETE FROM horario WHERE id = " + id + ""
      );
      console.log("result the id horario deleted", result);
      const { affectedRows } = result;

      if (affectedRows > 0) {
        res.status(200).json({
          status: "ok",
          message: "Datos eliminados de la base de datos.",
        });
      } else {
        res.status(400).json({
          status: "bad request",
          message: "No se encontro el horario en los registros.",
        });
      }
      return;
    }
    res.status(400).send("Bad Request.");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getHorarios = async (req, res) => {
  try {
    
    const result = await connection.query(
      "SELECT horario.id, horario.asignatura, detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin, persona.nombre, persona.apellido, persona.cedula FROM horario JOIN docente ON horario.docente = docente.id JOIN detalle_horario ON horario.id = detalle_horario.horario JOIN persona ON docente.persona = persona.id"
    );

    if (result !== undefined) {
      res.status(200).json(result);
      return;
    }
    res.status(500).json({
      status: "error",
      message: "No se pudo obtener la informacion de la base de datos.",
    });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getHorarioById = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { id } = req.params;
      
      const result = await connection.query(
        `SELECT 
horario.id, horario.asignatura, detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin, persona.nombre AS nombre_docente, persona.apellido AS apellido_docente, persona.cedula, docente.id AS docente_id, clase.salon, clase.estado, clase.fecha, salon.nombre, salon.numero_salon, salon.capacidad, salon.INTernet, salon.tv, 
categoria_salon.categoria
FROM horario
JOIN detalle_horario ON horario.id = detalle_horario.horario
JOIN docente ON horario.docente = docente.id
JOIN persona ON docente.persona = persona.id
JOIN clase ON horario.id = clase.horario
JOIN salon ON clase.salon = salon.id
JOIN categoria_salon ON salon.categoria_salon = categoria_salon.id
WHERE horario.id = ?`,
        [id]
      );

      const JOINHORARIODATA = result.reduce((a, row) => {
        const {
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
          capacidad,
          INTernet,
          tv,
          categoria,
        } = row;
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
          id,
          dia,
          estado,
          fecha,
          hora_inicio,
          hora_fin,
          numero_salon,
          capacidad,
          INTernet,
          tv,
          categoria,
        });
        return a;
      }, {});

      const resultArray = Object.values(JOINHORARIODATA);
      console.log(resultArray, "result array");
      if (resultArray.length > 0) {
        return res.status(200).json(resultArray);
      } else {
        return res
          .status(404)
          .json({ status: "error", message: "No records found." });
      }
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getHorariosByDocente = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;

      
      const result = await connection.query(
        `
       SELECT horario.id, horario.asignatura, detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin ,clase.id AS id_class, clase.estado, clase.fecha, salon.numero_salon, salon.nombre, categoria_salon.categoria
       FROM horario 
       JOIN clase ON clase.horario = horario.id
       JOIN salon ON clase.salon = salon.id
       JOIN categoria_salon ON salon.categoria_salon = categoria_salon.id 
       JOIN docente ON horario.docente = docente.id 
       JOIN persona ON docente.persona = persona.id 
       JOIN detalle_horario ON horario.id = detalle_horario.horario 
       WHERE persona.cedula = ?`,[cedula]);
      return res.status(200).json(result); 
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

export const methods = {
  saveHorario,
  updateHorario,
  deleteHorario,
  getHorarios,
  getHorarioById,
  getHorariosByDocente,
};

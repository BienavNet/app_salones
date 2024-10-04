import { connection } from "./../database/database.js";

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
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
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
    res
      .status(500)
      .json({
        status: "error",
        message: "Internal Server Error: " + error.message,
      });
  }
};
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
    res
      .status(500)
      .json({
        status: "error",
        message: "Internal Server Error: " + error.message,
      });
  }
};
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
    res
      .status(500)
      .json({
        status: "error",
        message: "Internal Server Error: " + error.message,
      });
  }
};

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
    res
      .status(500)
      .json({
        status: "error",
        message: "Internal Server Error: " + error.message,
      });
  }
};

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
    res
      .status(500)
      .json({
        status: "error",
        message: "Internal Server Error: " + error.message,
      });
  }
};

const registerClase = async (req, res) => {
  try {
    const { horario, salon, supervisor, estado, fecha } = req.body;
    if (!horario || !salon || !supervisor || !estado || !fecha) {
      return res
        .status(400)
        .json({
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
      return res
        .status(200)
        .json({
          status: "ok",
          message: "Datos almacenados correctamente en el servidor.",
        });
    }

    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

const deleteClase = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing id." });

    const [result] = await connection.query(
      "DELETE clase, reporte FROM clase LEFT JOIN reporte ON clase.id = reporte.clase WHERE clase.id = ?",
      [id]
    );

    const { affectedRows } = result;
    if (affectedRows == 1) {
      return res
        .status(200)
        .json({
          status: "ok",
          message: "Datos eliminados correctamente en el servidor.",
        });
    }

    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

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

const filterBySupSalDiaHor = async (req, res) => {
  try {
    const { cedula, salon, dia, horario } = req.params;
    if (!cedula)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing cedula." });

    let query = "";
    if (cedula != 0 && salon != 0 && dia != 0 && horario != 0)
      //cuando tiene todos los filtros aplicados
      query =
        "SELECT clase.*, detalle_horario.dia, detalle_horario.hora_inicio, hora_fin, horario.asignatura FROM clase JOIN supervisor ON clase.supervisor = supervisor.id JOIN persona ON persona.id = supervisor.persona JOIN horario ON clase.horario = horario.id JOIN detalle_horario ON detalle_horario.horario = horario.id WHERE persona.cedula = " +
        cedula +
        " AND clase.salon=" +
        salon +
        " AND clase.horario=" +
        horario +
        " AND detalle_horario.dia = " +
        dia +
        "";
    else if (cedula != 0 && salon != 0 && dia != 0 && horario == 0)
      // filtro de cedula, salon, dia
      query =
        "SELECT clase.* FROM clase JOIN supervisor ON clase.supervisor = supervisor.id JOIN persona ON persona.id = supervisor.persona JOIN horario ON clase.horario = horario.id JOIN detalle_horario ON detalle_horario.horario = horario.id WHERE persona.cedula = " +
        cedula +
        " AND clase.salon=" +
        salon +
        " AND detalle_horario.dia = " +
        dia +
        "";
    else if (cedula != 0 && salon != 0 && dia == 0 && horario == 0)
      // filtro cedula y salon
      query =
        "SELECT clase.* FROM clase JOIN supervisor ON clase.supervisor = supervisor.id JOIN persona ON persona.id = supervisor.persona JOIN horario ON clase.horario = horario.id WHERE persona.cedula = " +
        cedula +
        " AND clase.salon=" +
        salon +
        "";
    else if (cedula != 0 && salon == 0 && dia == 0 && horario == 0)
      // devuelve solo si se le envio la cedula
      query =
        "SELECT clase.*, salon.numero_salon, categoria_salon.categoria, docente_persona.nombre AS nombre_docente, docente_persona.apellido AS apellido_docente, detalle_horario.hora_inicio, detalle_horario.hora_fin, horario.asignatura FROM clase JOIN supervisor ON supervisor.id = clase.supervisor JOIN persona AS supervisor_persona ON supervisor_persona.id = supervisor.persona JOIN salon ON salon.id = clase.salon JOIN categoria_salon ON categoria_salon.id = salon.categoria_salon JOIN horario ON horario.id = clase.horario JOIN detalle_horario ON detalle_horario.horario = horario.id JOIN docente ON docente.id = horario.docente JOIN persona AS docente_persona ON docente_persona.id = docente.persona WHERE supervisor_persona.cedula = " +
        cedula +
        "";
    else if (cedula !== 0 && salon != 0 && dia != 0 && horario != 0)
      //todos los filtros
      query =
        "SELECT clase.* FROM clase JOIN horario ON clase.horario = horario.id JOIN detalle_horario ON detalle_horario.horario = horario.id WHERE clase.salon=" +
        salon +
        " AND clase.horario=" +
        horario +
        " AND detalle_horario.dia = " +
        dia +
        "";
    else if (cedula !== 0 && salon != 0 && dia != 0 && horario == 0)
      // filtro de salon y dia
      query =
        "SELECT clase.* FROM clase JOIN horario ON clase.horario = horario.id JOIN detalle_horario ON detalle_horario.horario = horario.id WHERE clase.salon=" +
        salon +
        " AND detalle_horario.dia = " +
        dia +
        "";
    else if (cedula !== 0 && salon != 0 && dia == 0 && horario == 0)
      // filtro de salon
      query = "SELECT clase.* FROM clase WHERE clase.salon=" + salon + "";
    else if (cedula !== 0 && salon == 0 && dia != 0 && horario != 0)
      // filtro de dia y horario
      query =
        "SELECT clase.* FROM clase JOIN horario ON clase.horario = horario.id JOIN detalle_horario ON detalle_horario.horario = horario.id WHERE clase.horario=" +
        horario +
        " AND detalle_horario.dia = " +
        dia +
        "";
    else if (cedula !== 0 && salon == 0 && dia != 0 && horario == 0)
      //filtro de solo dias
      query =
        "SELECT clase.* FROM clase JOIN horario ON clase.horario = horario.id JOIN detalle_horario ON detalle_horario.horario = horario.id WHERE detalle_horario.dia = " +
        dia +
        "";
    else if (cedula !== 0 && salon == 0 && dia == 0 && horario != 0)
      //filtro de solo horario
      query = "SELECT clase.* FROM clase WHERE clase.horario=" + horario + "";
    else {
      res.status(400).json({ status: "error", message: "Bad request." });
      return;
    }
    const [result] = await connection.query(query);
    if (result.length > 0) {
      res.status(200).json(result);
      return;
    }
    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const filterByDoc = async (req, res) => {
  try {
    const { cedula } = req.params;
    if (!cedula)
      return res
        .status(400)
        .json({ status: "error", message: "Bad Request: Missing cedula." });

    const [result] = await connection.query(
      `SELECT clase.* FROM clase JOIN horario ON clase.horario = horario.id JOIN docente ON horario.docente = docente.id JOIN persona ON docente.persona = persona.id WHERE persona.cedula = ${cedula}`
    );

    if (result.length > 0) {
      return res.status(200).json(result);
    }

    return res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

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
      res
        .status(404)
        .json({
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

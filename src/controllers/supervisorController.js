import { Validaciones } from "../assets/validation.js";
import { SALTROUNDS } from "../config.js";
import { connection } from "./../database/database.js";
import bcrypt from "bcryptjs";

const getSupervisorByCorreo = async (correo) => {
  const query = `
  SELECT persona.*, supervisor.id as docente_id 
  FROM persona 
  INNER JOIN supervisor ON persona.id = supervisor.persona 
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
// ✅
const getSupervisores = async (req, res) => {
  try {
    const [result] = await connection.query(
      "SELECT persona.*, supervisor.id as supervisor_id FROM persona INNER JOIN supervisor ON persona.id = supervisor.persona"
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(200).send("Internal Server Error: " + error.message);
  }
};
// ✅
const getSupervisorIdByCedula = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;
      const [result] = await connection.query(
        "SELECT persona.*, supervisor.id as supervisor_id, supervisor.persona as persona_id FROM supervisor INNER JOIN persona ON persona.id = supervisor.persona WHERE persona.cedula = " +
          cedula +
          ""
      );
      return res.status(200).json(result);
    } else {
      res.send(400, "Bad Request");
    }
  } catch (error) {
    res.status(200).send("Internal Server Error: " + error.message);
  }
};

const getSupervisorByCedula = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;
      const [result] = await connection.query(
        "SELECT persona.*, supervisor.id as supervisor_id FROM persona INNER JOIN supervisor ON persona.id = supervisor.persona WHERE persona.cedula = " +
          cedula +
          ";"
      );
      res.status(200).json(result);
    } else {
      res.send(400, "Bad Request");
    }
  } catch (error) {
    res.status(200).send("Internal Server Error: " + error.message);
  }
};

// ✅
const saveSupervisor = async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Bad Request.");
  }
  const { nombre, apellido, cedula, correo, contrasena } = req.body;
  try {
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
      const res = await getSupervisorByCorreo(correo);
      const iscedula = await getSupervisorByCedula(cedula);
      if (res || iscedula) {
        return res.status(409).json({
          message: "El supervisor con esta cédula o correo ya existe.",
          status: "ok",
        });
      } else {
        return res.status(409).json({
          message:
            "El correo o cédula ya está registrado pero NO es un SUPERVISOR.",
          status: "ok",
        });
      }
    }
    
  const hashedPassword = await bcrypt.hash(contrasena, SALTROUNDS);

  await connection.beginTransaction();
    const formatData = {
      nombre,
      apellido,
      cedula,
      correo,
      contrasena:hashedPassword,
    };
   
    let result = await connection.query("INSERT INTO persona SET ?", formatData);
    if (result.affectedRows > 0) {
      const { insertId } = result;
      result = await connection.query(
        "INSERT INTO supervisor (persona) VALUES (" + insertId + ")"
      );
      await connection.commit();
      return res.status(200).json({
          status: "ok",
          message: "Datos almacenados en la base de datos correctamente",
        });
    } else {
      return res.status(400).send("Bad Request.");
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

const updateSupervisor = async (req, res) => {
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
          res
            .status(200)
            .json({
              status: "ok",
              message: "Datos actualizados correctamente.",
            });
        } else {
          res
            .status(400)
            .json({
              status: "bad request",
              message: "No se encontro la cedula en los registros.",
            });
        }

        return;
      }
      res.status(400).send("Bad Request.");
    }
    res.status(400).send("Bad Request.");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// ✅
const deleteSupervisor = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;
      const [result] = await connection.query(
        "DELETE supervisor, persona FROM supervisor JOIN persona ON persona.id = supervisor.persona WHERE persona.cedula = " +
          cedula +
          ""
      );
      const { affectedRows } = result;
      if (affectedRows > 0) {
        res
          .status(200)
          .json({
            status: "ok",
            message: "Datos eliminados de la base de datos.",
          });
      } else {
        res
          .status(400)
          .json({
            status: "bad request",
            message: "No se encontro la cedula en los registros.",
          });
      }
      return;
    }
    res.status(400).send("Bad Request.");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

export const methods = {
  getSupervisores,
  getSupervisorIdByCedula,
  getSupervisorByCedula,
  saveSupervisor,
  updateSupervisor,
  deleteSupervisor,
};

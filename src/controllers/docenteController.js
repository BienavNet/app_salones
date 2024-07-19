import { methods as database } from "./../database/database.js";
import { Validaciones } from "../assets/validation.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { SALTROUNDS } from "../config.js";

const getDocentes = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query(
      "SELECT persona.*, docente.id as docente_id FROM persona INNER JOIN docente ON persona.id = docente.persona"
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

 /// # Hay que arreglar este methodo 


const getDocenteIdByCedula = async (req, res) => {
  try {
    if (!req.params || !req.params.cedula) {
      return res.status(400).send("Bad Request");
    }

    const { cedula } = req.params;
    const connection = await database.getConnection();
    try {
      const result = await connection.query(
        "SELECT docente.id as docente_id, docente.persona as persona_id FROM docente INNER JOIN persona ON persona.id = docente.persona WHERE persona.cedula = " +
          cedula +
          ""
      );
    } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getDocenteByCedula = async (req, res) => {
    try {
        if (req.params !== undefined) {
            const { cedula } = req.params
            const connection = await database.getConnection()
            //const result = await connection.query("SELECT p.*, d.* FROM persona as p, docente as d WHERE p.cedula = " +cedula+ " and d.persona = p.id")
            const result = await connection.query("SELECT persona.*, docente.id as docente_id FROM persona INNER JOIN docente ON persona.id = docente.persona WHERE persona.cedula = " + cedula + ";")
            res.status(200).json(result)
            return
        } 
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}
// const getDocenteByCedula = async (cedula) => {
//   try {
//     const connection = await database.getConnection();
//     return await connection.query("SELECT persona.*, docente.id as docente_id FROM persona INNER JOIN docente ON persona.id = docente.persona WHERE persona.cedula = " +cedula + ";");
//   } catch (error) {
//     throw new Error({
//         status: 500,
//         message: "Internal Server Error:" + error.message,
//     });
//   }
// };

const getDocenteByCorreo = async (correo) => {
  try {
      const connection = await database.getConnection();
      return await connection.query("SELECT persona.*, docente.id as docente_id FROM persona INNER JOIN docente ON persona.id = docente.persona WHERE persona.correo = " + correo + ";");
  } catch (error) {
    throw new Error({
        status: 500,
        message: "Internal Server Error:" + error.message,
    });
  }
};

const saveDocente = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

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
        .json({ status: "Bad Request", message: validationError.message });
    }

    // validamos que no se repita la cedula
    // const existCedula = await getDocenteByCedula(cedula);
    // if (existCedula.length > 0) {
    //   return res
    //     .status(409)
    //     .json({
    //       status: "error",
    //       message: "El docente con esta cédula ya existe.",
    //     });
    // }

    // validamos que no se repita la cedula
    // const existCedula = await getDocenteByCedula(cedula);
    // if (existCedula.length > 0) {
    //   return res
    //     .status(409)
    //     .json({
    //       status: "error",
    //       message: "El docente con esta cédula ya existe.",
    //     });
    // }
    // validamos que no se repita el correo
    // const existCorreo = await getDocenteByCorreo(correo);
    // if (existCorreo.length > 0) {
    //   return res
    //     .status(409)
    //     .json({
    //       status: "error",
    //       message: "El docente con este correo ya existe.",
    //     });
    // }

    //generamos los id de la tabla persona
    const id = crypto.randomUUID();

    //antes de crear el user haseamos la password
    const hashedPassword = await bcrypt.hash(contrasena, SALTROUNDS);

    const connection = await database.getConnection();
    console.log("conexion", connection);
    try {
      await connection.beginTransaction();
      const formatData = {
        id:id,
        nombre,
        apellido,
        correo,
        cedula,
        contrasena: hashedPassword,
      };

      var result = await connection.query(
        "INSERT INTO persona SET ?",
        formatData
      );

      if (result !== undefined) {
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
        throw new Error({
            status: 400,
            message: "Bad Request."
        });
      }
    } catch (error) {
      await connection.rollback();
      console.log("error en la rollback");
      res.status(500).send("Internal Server Error: " + error.message);
      throw error;
    }
  } catch (error) {
    console.log("error catch, aqui entra el error", error.message);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const updateDocente = async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    if (req.params !== undefined) {
      const { cedula } = req.params;
      if (req.body !== undefined) {
        // const { nombre, apellido, correo, contrasena } = req.body
        const connection = await database.getConnection();
        const result = await connection.query(
          "UPDATE persona SET ? WHERE cedula = " + cedula + "",
          req.body
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
      res.status(400).send("Bad Request.");
    }
    res.status(400).send("Bad Request.");
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const deleteDocente = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;
      const connection = await database.getConnection();
      const result = await connection.query(
        "DELETE docente, persona FROM docente JOIN persona ON persona.id = docente.persona WHERE persona.cedula = " +
          cedula +
          ""
      );

      const { affectedRows } = result;
      const connection = await database.getConnection();
      const result = await connection.query(
        "DELETE docente, persona FROM docente JOIN persona ON persona.id = docente.persona WHERE persona.cedula = " +
          cedula +
          ""
      );

      const { affectedRows } = result;
      if (affectedRows > 0) {
        res.status(200).json({
          status: "ok",
          message: "Datos eliminados de la base de datos.",
        });
      } else {
        res.status(400).json({
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

const countDocente = async (req, res) => {
  const connection = await database.getConnection();
  const [result] = await connection.query("SELECT COUNT(*) FROM docente");
  res.json(result[0]("COUNT(*)"));
};

export const methods = {
  getDocentes,
  getDocenteIdByCedula,
  getDocenteByCedula,
  saveDocente,
  updateDocente,
  deleteDocente,
  countDocente,
};

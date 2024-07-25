import { methods as database } from "./../database/database.js";
import { Validaciones } from "../assets/validation.js";
import bcrypt from "bcrypt";
import { SALTROUNDS } from "../config.js";

const getDocentes = async (req, res, next) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query(
      "SELECT persona.*, docente.id as docente_id FROM persona INNER JOIN docente ON persona.id = docente.persona"
    );
    res.status(200).json(result);
    console.log("result", result);
    next()
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

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
        "cedula" +
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
      const { cedula } = req.params;
      const connection = await database.getConnection();
      //const result = await connection.query("SELECT p.*, d.* FROM persona as p, docente as d WHERE p.cedula = " +cedula+ " and d.persona = p.id")
      const result = await connection.query(
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

const getPersonaByCorreo = async (correo, cedula) => {
  const connection = await database.getConnection();
  const query = `
    SELECT * 
    FROM persona 
    WHERE correo = ? OR cedula = ? 
    LIMIT 1;
  `;
  try {
    const result = await connection.query(query, [correo, cedula]);
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
const getCedulaDocente = async (cedula) => {
  const connection = await database.getConnection();
  const query = `
  SELECT persona.*, docente.id as docente_id 
  FROM persona
  INNER JOIN docente ON persona.id = docente.persona
  WHERE persona.cedula = ?`;
  try {
    const result = await connection.query(query, [cedula]);
    return result.length === 0 ? null : result;
  } catch (error) {
    throw new Error({
      status: 500,
      message: "Internal Server Error:" + error.message,
    });
  }
};

// ✅
const getDocenteByCorreo = async (correo) => {
  const connection = await database.getConnection();
  const query = `
  SELECT persona.*, docente.id as docente_id 
  FROM persona 
  INNER JOIN docente ON persona.id = docente.persona 
  WHERE persona.correo = ?`;
  try {
    const result = await connection.query(query, [correo]);
    return result.length === 0 ? null : result;
  } catch (error) {
    throw new Error({
      status: 500,
      message: "Internal Server Error:" + error.message,
    });
  }
};

// ✅
const saveDocente = async (req, res) => {
  if (!req.body) res.status(400).send("Bad Request.");
  try {
    res.setHeader("Content-Type", "application/json");

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
    const connection = await database.getConnection();
    try {
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
          message: "Bad Request.",
        });
      }
    } catch (error) {
      await connection.rollback();
      console.log("error en la rollback");
      res.status(500).send("Internal Server Error: " + error.message);
      throw error;
    }
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};


const protectedHome = (req, res) => {
 const token = req.cookies.access_token
 if(!token){
  return res.status(403).send({
    message: "Access not allowed",
  })
 }
try {
  const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
  console.log(data, "data verified token JWT")
} catch (error) {
  res.status(401).send({
    message: "Access not autorized",
  })
}

}

const logoutS = (req, res) => {
  res.clearCookie('access_token')
  .json({
    message: "Logged out successfully",
    status: "ok",
  })
 }

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

      // const { affectedRows } = result;
      // const connection = await database.getConnection();
      // const result = await connection.query(
      //   "DELETE docente, persona FROM docente JOIN persona ON persona.id = docente.persona WHERE persona.cedula = " +
      //     cedula +
      //     ""
      // );

      // if (req.params !== undefined) {
      //   const { cedula } = req.params;
      //  const connection = await database.getConnection();
      //   const result = await connection.query(
      //     "DELETE docente, persona FROM docente JOIN persona ON persona.id = docente.persona WHERE persona.cedula = " +
      //       cedula +
      //       ""
      //   );

      //   const { affectedRows } = result;
      //   const connection = await database.getConnection();
      //   const result = await connection.query(
      //     "DELETE docente, persona FROM docente JOIN persona ON persona.id = docente.persona WHERE persona.cedula = " +
      //       cedula +
      //       ""
      //   );

      //   const { affectedRows } = result;
      //   if (affectedRows > 0) {
      //     res.status(200).json({
      //       status: "ok",
      //       message: "Datos eliminados de la base de datos.",
      //     });
      //   } else {
      //     res.status(400).json({
      //       status: "bad request",
      //       message: "No se encontro la cedula en los registros.",
      //     });
      //   }
      //   return;
      // }

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
  countDocente
  // loginDocente,
  // protectedHome
};

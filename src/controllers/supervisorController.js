import { Validaciones } from "../assets/validation.js";
import { SALTROUNDS } from "../config.js";
import { connection } from "./../database/database.js";
import bcrypt from "bcryptjs";

// Obtiene los registros de la tabla supervisor si el correo coincide con el correo registrado
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

// Consulta en la tabla persona si el registro contiene el correo pasado
const getPersonaByCorreo = async (correo, cedula) => {
  try {
    const [result] = await connection.query(
      "SELECT * FROM persona WHERE correo = ? OR cedula = ? LIMIT 1",
      [correo, cedula]
    );
    if (result.length === 0) {
      return null; // No se encontró la persona
    }
    return result;
  } catch (error) {
    throw new Error({
      status: 500,
      message: "Internal Server Error:" + error.message,
    });
  }
};

// Obtiene todos los registros de la tabla supervisor
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

// Obtiene el campo id de la tabla supervisor si el parametro pasado coincide con la cedula
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

// Obtiene los registros de la tabla supervisor si el parametro pasado coincide con la cedula
const getSupervisorByCedula = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;
      const [result] = await connection.query(
        "SELECT persona.*, supervisor.id as supervisor_id FROM persona INNER JOIN supervisor ON persona.id = supervisor.persona WHERE persona.cedula = " +
          cedula +
          ";"
      );
      if (result.length === 0) {
        return res.status(404).json({
          status: "not found",
          message: "No se encontraron registros para la cédula proporcionada.",
        });
      }
      return res.status(200).json(result);
    } else {
      return res.send(400, "Bad Request");
    }
  } catch (error) {
    return res.status(200).send("Internal Server Error: " + error.message);
  }
};

// Guarda un nuevo registro en la tabla supervisor
const saveSupervisor = async (req, res) => {
  if (!req.body) {
    return res.status(400).send("Bad Request.");
  }
  const { nombre, apellido, cedula, correo, contrasena } = req.body;

  if (!nombre || !apellido || !cedula || !correo || !contrasena) {
    return res.status(400).send("Bad Request: Missing required fields.");
  }

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
    const formatData = {
      nombre,
      apellido,
      cedula,
      correo,
      contrasena: hashedPassword,
    };

    const [result] = await connection.query(
      "INSERT INTO persona SET ?",
      formatData
    );
    if (result.affectedRows > 0) {
      const { insertId } = result;
      const [supervisorResult] = await connection.query(
        "INSERT INTO supervisor (persona) VALUES (?)",
        [insertId]
      );
      if (supervisorResult.affectedRows > 0) {
        return res.status(200).json({
          status: "ok",
          message: "Datos almacenados en la base de datos correctamente",
        });
      } else {
        return res.status(400).json({
          status: "Bad Request",
          message: "No se pudo asignar la persona como supervisor.",
        });
      }
    } else {
      return res.status(400).send("Bad Request.");
    }
  } catch (error) {
    return res.status(500).json({
      status: "Internal Server Error",
      message: "Error en la operación: " + error.message,
    });
  }
};

// Actualiza un registro preexistente en la tabla supervisor
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

// Elimina un registro preexistente de la tabla supervisor
const deleteSupervisor = async (req, res) => {
  try {
    if (req.params !== undefined) {
      const { cedula } = req.params;
      // Verificamos si hay supervisores y si el supervisor por defecto es el único en la base de datos
      const [resultCount] = await connection.query(
        `SELECT COUNT(*) AS total_supervisores,
                MAX(CASE WHEN defaultItem = 1 THEN 1 ELSE 0 END) AS is_default_supervisor
         FROM supervisor
         JOIN persona ON supervisor.persona = persona.id`
      );
      const { total_supervisores, is_default_supervisor } = resultCount[0];

      // Validar si estamos intentando eliminar al único supervisor o al supervisor por defecto
      if (total_supervisores <= 1 && is_default_supervisor === 1) {
        return res.status(400).json({
          status: "bad request",
          message:
            "Debe haber al menos un supervisor en la base de datos y no se puede eliminar el supervisor por defecto.",
        });
      }

      // Buscamos el supervisor a eliminar y asegurarnos de que no es el supervisor por defecto
      const [supervisorToDelete] = await connection.query(
        "SELECT * FROM supervisor WHERE persona IN (SELECT id FROM persona WHERE cedula = ?) AND defaultItem = 1",
        [cedula]
      );

      if (supervisorToDelete.length > 0) {
        return res.status(400).json({
          status: "bad request",
          message: "No se puede eliminar el supervisor por defecto.",
        });
      }

      // Obtener el id de supervisor correspondiente al persona.id de la cedula a eliminar
      const [query1] = await connection.query(
        "SELECT supervisor.id, supervisor.persona FROM supervisor JOIN persona ON supervisor.persona = persona.id WHERE persona.cedula = ?",
        [cedula]
      );
      const superviosrToDeletePersona = query1[0]?.peronsa;
      const supervisorToReassignId = query1[0]?.id;

      // Verificamos que el supervisor exista antes de realizar la asignación
      if (!supervisorToReassignId) {
        return res.status(400).json({
          status: "bad request",
          message: "No se encontró el supervisor para la cédula proporcionada.",
        });
      }

      // Obtener un supervisor aleatorio para reasignar las clases
      const [query2] = await connection.query(
        "SELECT id FROM supervisor WHERE persona != (SELECT id FROM persona WHERE cedula = ?) ORDER BY RAND() LIMIT 1;",
        [cedula]
      );
      const newSupId = query2[0].id;

      // Reasignar las clases del supervisor a otro supervisor
      const [updateClassesResult] = await connection.query(
        "UPDATE clase SET supervisor = ? WHERE supervisor = ?",
        [newSupId, supervisorToReassignId]
      );

      // Si no se a actualizó ninguna clase, reasignamos las clases donde supervisor se null
      if (updateClassesResult.affectedRows === 0) {
        const [classesToReassign] = await connection.query(
          "SELECT * FROM clase WHERE supervisor IS NULL"
        );

        if (classesToReassign.length > 0) {
          // Obtener el supervisor por defecto
          const [defaultSupervisor] = await connection.query(
            "SELECT id FROM supervisor WHERE defaultItem = 1"
          );

          // Si no hay supervisor por defecto, o si no hay clases para reasignar, salimos
          if (!defaultSupervisor || defaultSupervisor.length === 0) {
            return;
          }

          const defaultSupervisorId = defaultSupervisor[0].id;

          // Obtener todos los supervisores disponibles, excluyendo al supervisor que estamos eliminando
          const [availableSupervisors] = await connection.query(
            "SELECT id FROM supervisor WHERE id != ?",
            [newSupId]
          );
          // Si hay solo 2 supervisores disponibles, reasignamos todas las clases al supervisor por defecto
          if (availableSupervisors.length === 1) {
            // Reasignamos todas las clases al supervisor por defecto
            for (const clase of classesToReassign) {
              await connection.query(
                "UPDATE clase SET supervisor = ? WHERE id = ?",
                [defaultSupervisorId, clase.id]
              );
            }
          } else {
            // Si hay más de 2 supervisores disponibles, asignamos las clases de forma cíclica
            const supervisors = availableSupervisors;
            const numSupervisors = supervisors.length;
            let supervisorIndex = 0;

            for (const clase of classesToReassign) {
              const selectedSupervisor = supervisors[supervisorIndex];
              await connection.query(
                "UPDATE clase SET supervisor = ? WHERE id = ?",
                [selectedSupervisor.id, clase.id]
              );

              supervisorIndex = (supervisorIndex + 1) % numSupervisors;
            }
          }
        }
      }

      // Eliminar las notificaciones asociadas al supervisor
      await connection.query(
        "DELETE FROM notificacion WHERE de = ? OR para = ?",
        [superviosrToDeletePersona, superviosrToDeletePersona]
      );

      // Eliminar el supervisor de la base de datos
      const [result] = await connection.query(
        "DELETE FROM supervisor WHERE id = ?",
        [supervisorToReassignId]
      );

      // Eliminar la persona asociada
      await connection.query("DELETE FROM persona WHERE cedula = ?", [cedula]);

      const { affectedRows } = result;
      if (affectedRows > 0) {
        res.status(200).json({
          status: "ok",
          message: "Datos eliminados de la base de datos.",
        });
      } else {
        res.status(400).json({
          status: "bad request",
          message: "No se encontró la cédula en los registros.",
        });
      }
      return;
    }
    return res.status(400).send("Bad Request.");
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};
const deleteAllSupervisors = async (req, res) => {
  try {
    // Verificamos cuántos supervisores existen y si hay un supervisor por defecto
    const [resultCount] = await connection.query(
      `SELECT COUNT(*) AS total_supervisores,
              MAX(CASE WHEN defaultItem = 1 THEN 1 ELSE 0 END) AS is_default_supervisor
       FROM supervisor`
    );
    const { total_supervisores, is_default_supervisor } = resultCount[0];
    if (total_supervisores === 1 && is_default_supervisor === 1) {
      return res.status(400).json({
        status: "bad request",
        message:
          "Debe haber al menos un supervisor y no se puede eliminar el supervisor por defecto.",
      });
    }

    // Obtener todos los supervisores que no sean el supervisor por defecto
    const [supervisors] = await connection.query(
      "SELECT id, persona FROM supervisor WHERE defaultItem IS NULL"
    );

    if (supervisors.length === 0) {
      return res.status(400).json({
        status: "bad request",
        message: "No hay supervisores para eliminar.",
      });
    }

    // Lista de IDs de supervisores a eliminar
    const supervisorIds = supervisors.map((s) => s.id);

    // Establecer supervisor como NULL en las clases que tenían estos supervisores
    if (supervisorIds.length > 0) {
      await connection.query(
        "UPDATE clase SET supervisor = NULL WHERE supervisor IN (?)",
        [supervisorIds]
      );
    }

    // Eliminar todas las notificaciones asociadas con los supervisores
    const personaIds = supervisors.map((s) => s.persona);
    if (personaIds.length > 0) {
      await connection.query(
        "DELETE FROM notificacion WHERE de IN (?) OR para IN (?)",
        [personaIds, personaIds]
      );
    }

    // Eliminar supervisores
    if (supervisorIds.length > 0) {
      await connection.query("DELETE FROM supervisor WHERE id IN (?)", [
        supervisorIds,
      ]);
    }

    // Eliminar personas asociadas a los supervisores eliminados
    if (personaIds.length > 0) {
      await connection.query("DELETE FROM persona WHERE id IN (?)", [
        personaIds,
      ]);
    }

    res.status(200).json({
      status: "ok",
      message: "Todos los supervisores han sido eliminados correctamente.",
    });
  } catch (error) {
    console.error("Error en deleteAllSupervisors:", error);
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

const defaultItemStatus = async (req, res) => {
  try {
    const [query] = await connection.query(
      "SELECT * FROM supervisor WHERE defaultItem = 1 ORDER BY defaultItem DESC"
    );
    if (query.length > 0) {
      return res.status(200).json({
        status: "ok",
        message: "Se han encontrado los registros con defaultItem.",
        data: query,
      });
    } else {
      return res.status(404).json({
        status: "not found",
        message: "No se encontraron registros para defaultItem.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Hubo un problema al obtener los registros.",
    });
  }
};

const updateDefaultItemStatus = async (req, res) => {
  if (!req.params || !req.params.id) {
    return res.status(400).send("Bad Request. Missing parameters.");
  }

  try {
    const { id } = req.params;

    const [existingSupervisor] = await connection.query(
      `SELECT id FROM supervisor WHERE defaultItem = 1 LIMIT 1`
    );

    if (existingSupervisor.length > 0) {
      await connection.query(
        `UPDATE supervisor SET defaultItem = NULL WHERE defaultItem = 1`
      );
    }
    const [result] = await connection.query(
      `UPDATE supervisor SET defaultItem = 1 WHERE persona = ?`,
      [id]
    );

    const { affectedRows } = result;
    if (affectedRows > 0) {
      return res
        .status(200)
        .json({ status: "ok", message: "Default supervisor successfully." });
    } else {
      return res.status(400).json({
        status: "not found",
        message: "Problemas al actualizar por defecto un supervisor",
      });
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const methods = {
  getSupervisores,
  getSupervisorIdByCedula,
  getSupervisorByCedula,
  saveSupervisor,
  updateSupervisor,
  deleteSupervisor,
  defaultItemStatus,
  updateDefaultItemStatus,
  deleteAllSupervisors,
};

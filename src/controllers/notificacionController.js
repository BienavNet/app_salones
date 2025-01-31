import { connection } from "../database/database.js";
import sendNotificationEmail from "../utils/serverResend.js";
import { io } from "../utils/WebsocketServer.js";

const getRoleByTables = async (de) => {
  try {
    // Verificar si la persona es docente
    const [docenteResult] = await connection.query(
      `SELECT 'docente' AS rol FROM docente WHERE docente.persona = ? LIMIT 1;`,
      [de]
    );
    if (docenteResult.length > 0) {
      return "docente";
    }

    // Verificar si la persona es supervisor
    const [supervisorResult] = await connection.query(
      `SELECT 'supervisor' AS rol FROM supervisor WHERE supervisor.persona = ? LIMIT 1;`,
      [de]
    );
    if (supervisorResult.length > 0) {
      return "supervisor";
    }
    return null;
  } catch (error) {
    throw new Error("Error fetching role by tables: " + error.message);
  }
};

//cuenta las notifaciones no leidas
export const getUnreadCount = async (userId) => {
  const NOLEIDA = "no leida";
  //
  const [unreadResult] = await connection.query(
    `SELECT COUNT(*) AS no_leida 
     FROM notificacion 
     WHERE para = ? AND estado = ?`,
    [userId, NOLEIDA]
  );
  return unreadResult[0].no_leida;
};

/* Obtiene las notificaciones de la base de datos dependiendo de la cedula y si la notificacion no ha sido leida */
const getNotifications = async (req, res) => {
  try {
    const { cedula, estado } = req.params;
    if (cedula === undefined || estado === undefined) {
      res.status(400).json({ status: "error", message: "Missing parameters." });
      return;
    }
    //
    let query = "";
    const params = [cedula];

    if (estado === "todas") {
      query = `
                SELECT 
                    n.*, 
                    p1.nombre AS nombre_de, 
                    p1.apellido AS apellido_de,
                    p2.nombre AS nombre_para, 
                    p2.apellido AS apellido_para
                FROM 
                    notificacion n
                JOIN 
                    persona p1 ON n.de = p1.id
                JOIN 
                    persona p2 ON n.para = p2.id
                WHERE 
                    p2.cedula = ?
            `;
    } else {
      query = `
                SELECT 
                    n.*, 
                    p1.nombre AS nombre_de, 
                    p1.apellido AS apellido_de,
                    p2.nombre AS nombre_para, 
                    p2.apellido AS apellido_para
                FROM 
                    notificacion n
                JOIN 
                    persona p1 ON n.de = p1.id
                JOIN 
                    persona p2 ON n.para = p2.id
                WHERE 
                    p2.cedula = ? AND n.estado = ?
            `;
      params.push(estado);
    }
    const [result] = await connection.query(query, params);
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    return res.status(200).json([]);
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

/// Obtiene todas las notificaciones registradas en la base de datos
const getAll = async (req, res) => {
  try {
    const [result] = await connection.query("SELECT * FROM notificacion");
    if (result.length > 0) {
      res.status(200).json(result);
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

/// Estandariza los mensajes de respuesta de las notificaciones
const getMessage = async (id, params) => {
  const [result] = await connection.query(
    `SELECT p1.nombre AS de_nombre, p2.nombre AS para_nombre
     FROM persona p1, persona p2
     WHERE p1.id = ? AND p2.id = ?`,
    [params.de, params.para]
  );
  try {
    if (result.length === 0) {
      throw new Error("No se encontraron personas con los IDs proporcionados");
    }
    const { de_nombre, para_nombre } = result[0];
    const messages = {
      "clase revisada": {
        message: "El supervisor $de ha revisado la clase de $para",
      },
      "reporte enviado": {
        message:
          "El supervisor $de ha reportado una observacion a la clase de $para",
      },
      comentario: {
        message: "El docente $de ha realizado un comentario",
      },
    };
    return {
      message: messages[id].message
        .replace("$de", de_nombre)
        .replace("$para", para_nombre),
      de_nombre,
    };
  } catch (error) {
    return undefined;
  }
};

const getParaByCorreo = async (id) => {
  const query = `
    SELECT persona.correo FROM persona WHERE id = ? LIMIT 1;
  `;
  try {
    const [result] = await connection.query(query, [id]);
    if (result.length === 0) {
      return null;
    }
    return result[0].correo;
  } catch (error) {
    throw new Error({
      status: 500,
      message: "Internal Server Error:" + error.message,
    });
  }
};
const getClassId = async (classId) => {
  const query = `
    SELECT persona.id
    FROM clase
    JOIN horario ON clase.horario = horario.id
    JOIN docente ON horario.docente = docente.id
    JOIN persona ON docente.persona = persona.id
    WHERE clase.id = ? LIMIT 1;
  `;
  try {
    const [result] = await connection.query(query, [classId]);
    if (result.length === 0) {
      return null; 
    }
    return result[0].id; 
  } catch (error) {
    throw new Error("Error fetching docente name: " + error.message);
  }
};

const getSupervisorEmailByClass = async (Idclass) => {
  const query = `
  SELECT persona.correo 
  FROM clase 
  JOIN supervisor ON clase.supervisor = supervisor.id 
  JOIN persona ON supervisor.persona = persona.id 
  WHERE clase.id = ? LIMIT 1;
  `;
  
  try {
    const [result] = await connection.query(query, [Idclass]);
    if (result.length === 0) {
      ("No se encontró un supervisor para la clase con ID:", Idclass);
      return null;
    }

    const supervisorEmail = result[0]?.correo;
    
    if (!supervisorEmail) {
      ("No se encontró correo para el supervisor de la clase con ID:", Idclass);
      return null;
    }
    return supervisorEmail;
  } catch (error) {
    throw new Error("Error fetching supervisor email: " + error.message);
  }
};

/// Consulta el mensaje de respuesta segun la accion, y envia la notificacion a la persona que le corresponda dicha cedula
const sendNotification = async (req, res) => {
  try {
    if (req.body !== undefined) {
      const { action, de, para, idclass } = req.body;
 
      if (action !== undefined && de !== undefined && para !== undefined && idclass !== undefined) {

        const rol = await getRoleByTables(de);
        if (!rol) {
          return res.status(404).json({
            status: "error",
            message: "Usuario no encontrado en las tablas de roles.",
          });
        }

        const correo = await getParaByCorreo(para);
        if (!correo) {
          return res.status(404).json({
            status: "error",
            message: "Correo del destinatario no encontrado.",
          });
        }
        
        const idDocenteAsociadoAlaclase = await getClassId(idclass)

        const { message, de_nombre } = await getMessage(action, {de: de, para: idDocenteAsociadoAlaclase});

        const [result] = await connection.query(
          `INSERT INTO notificacion (mensaje, de, para, estado, fecha) VALUES (?, ?, ?, 'no leida', NOW())`,
          [message, de, para]
        );

        const { insertId, affectedRows } = result;
        if (affectedRows == 1 && insertId !== undefined) {
          const emailPromises = [];
          const data = await getUnreadCount(para);

          if (rol === "supervisor") {
            emailPromises.push(
              sendNotificationEmail({
                nombre: de_nombre,
                correo: correo,
                mensaje: message,
              })
            );
          }

          if (rol === "docente") {
            const correoSupervisor = await getSupervisorEmailByClass(idclass);
            const destinatarios = [correo];
            if (correoSupervisor) {destinatarios.push(correoSupervisor);}
            emailPromises.push(
              sendNotificationEmail({
                nombre: de_nombre,
                correo: destinatarios.flat(),
                mensaje: message,
              })
            );
          }

          await Promise.all(emailPromises);

          res.status(200).json({
            status: "ok",
            id: insertId,
            message: "Notificación almacenada y enviada correctamente",
          });

          io.to(para).emit("new_notificacion", {
            success: true,
            messageId: insertId,
          });

          return io.to(para).emit("count-notification", data);
        }
        return res.status(400).json({
          status: "error",
          message: "Error en la inserción de datos.",
        });
      }
      return res
        .status(400)
        .json({ status: "error", message: "Bad request: faltan campos." });
    }
    res.status(400).json({
      status: "error",
      message: "Bad request: datos no proporcionados.",
    });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};

// Cambia el estado de la notificacion
const editNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    if (!id || !estado) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing parameters." });
    }

    const query = "UPDATE notificacion SET estado = ? WHERE id = ?";
    const [result] = await connection.query(query, [estado, id]);

    if (result.affectedRows > 0) {
      const paraQuery = `SELECT para FROM notificacion WHERE id = ?`;
      const [paraResult] = await connection.query(paraQuery, [id]);
      const para = paraResult[0]?.para;
      if (para) {
        const unreadCount = await getUnreadCount(para);
        io.to(para.toString()).emit("count-notification", unreadCount);
        return res.status(200).json({
          status: "success",
          message: "Notification updated successfully.",
        });
      }
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Notification not found." });
    }
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

export const methods = {
  getAll,
  getNotifications,
  sendNotification,
  editNotificacion,
};

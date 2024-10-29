import { connection} from "../database/database.js";

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
const getMessage = (id, params) => {
  
  try {
    
    const messages = {
      "clase revisada": {
        "message": "El supervisor $de ha revisado la clase de $para"
      },
      "reporte enviado": {
        "message": "El supervisor $de ha reportado una observacion a la clase de $para"
      },
      "comentario": {
        "message": "El docente $de ha realizado un comentario"
      }
    }
    return messages[id].message.replace('$de', params.de).replace('$para', params.para)
  } catch (error) {
    return undefined
  }
}


/// Consulta el mensaje de respuesta segun la accion, y envia la notificacion a la persona que le corresponda dicha cedula
const sendNotification = async (req, res) => {
  try {
    
    if (req.body !== undefined) {
      const { action, de, para } = req.body;
      if (action !== undefined && de !== undefined && para !== undefined) {
        const mensaje = getMessage(action, { "de": de, "para": para }) //modificacion para que filtre el id del mensaje en el archivo json y adicional reemplace los valores de y para en el mensaje
        console.log(mensaje)
        const [result] = await connection.query(
          `INSERT INTO notificacion (mensaje, de, para, estado, fecha) VALUES (?, ?, ?, 'no leida', NOW())`, [mensaje, de, para]);
        const { insertId, affectedRows } = result;
        if (affectedRows == 1 && insertId !== undefined) {
          const data = await getUnreadCount(para);
          res.status(200).json({
            status: "ok",
            id: insertId,
            message: "Notificación almacenada y enviada correctamente",
          });
          console.log(" unreadCount data para", data, para);
          io.to(para).emit("count-notification", data);
          return;
        }
        res.status(400).json({
          status: "error",
          message: "Error en la inserción de datos.",
        });
        return;
      }
      res
        .status(400)
        .json({ status: "error", message: "Bad request: faltan campos." });
      return;
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

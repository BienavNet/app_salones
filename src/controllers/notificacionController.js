import { methods as database } from "../database/database.js";
import { NotificationMessages as messages } from "../assets/notificationsMessages.js";
import { io } from "../utils/WebsocketServer.js";

export const getUnreadCount = async (userId) => {
  const NOLEIDA = "no leida";
  const connection = await database.getConnection();
  const unreadResult = await connection.query(
    `SELECT COUNT(*) AS no_leida 
     FROM notificacion 
     WHERE para = ? AND estado = ?`,
    [userId, NOLEIDA]
  );
  return unreadResult[0].no_leida;
};

const getNotifications = async (req, res) => {
  try {
    const { cedula, estado } = req.params;
    if (cedula === undefined || estado === undefined) {
      res.status(400).json({ status: "error", message: "Missing parameters." });
      return;
    }
    const connection = await database.getConnection();
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
    const result = await connection.query(query, params);
    if (result.length > 0) {
      return res.status(200).json(result);
    }
    return res.status(200).json([]);
  } catch (error) {
    return res.status(500).send("Internal Server Error: " + error.message);
  }
};

const getAll = async (req, res) => {
  try {
    const connection = await database.getConnection();
    const result = await connection.query("SELECT * FROM notificacion");
    if (result !== undefined) {
      res.status(200).json(result);
      return;
    }
    res.status(400).json({ status: "error", message: "Bad request." });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};
const sendNotification = async (req, res) => {
  console.log("req.body;",req.body);
  try {
    if (req.body !== undefined) {
      const { mensaje, de, para } = req.body;

      if (mensaje !== undefined && de !== undefined && para !== undefined) {
        const connection = await database.getConnection();
        const result = await connection.query(
          `INSERT INTO notificacion (mensaje, de, para, estado, fecha) 
           VALUES (?, ?, ?, 'no leida', NOW())`,
          [mensaje, de, para]
        );
        console.log(result, "result notificacion");
        const { insertId, affectedRows } = result;
        if (affectedRows == 1 && insertId !== undefined) {
          const unreadCount = await getUnreadCount(para);
          // const NOLEIDA = "no leida";
          // const unreadResult = await connection.query(
          //   `SELECT COUNT(*) AS no_leida 
          //    FROM notificacion 
          //    WHERE para = ? AND estado = ?`,
          //   [para, NOLEIDA]
          // );
          // const unreadCount = unreadResult[0].no_leida;
          // console.log("unreadCount:", unreadCount);
          // // Emitir la notificación a la sala del usuario "para"
          io.to(para).emit("notification", unreadCount);

          return res.status(200).json({
            status: "ok",
            id: insertId,
            message: "Notificación almacenada y enviada correctamente",
          });
        }
        res
          .status(400)
          .json({
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

    res
      .status(400)
      .json({
        status: "error",
        message: "Bad request: datos no proporcionados.",
      });
  } catch (error) {
    res.status(500).send("Internal Server Error: " + error.message);
  }
};


const editNotificacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    if (!id || !estado) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing parameters." });
    }
    const connection = await database.getConnection();
    const query = "UPDATE notificacion SET estado = ? WHERE id = ?";
    const result = await connection.query(query, [estado, id]);

    if (result.affectedRows > 0) {
    const paraQuery = `SELECT para FROM notificacion WHERE id = ?`;
    const paraResult = await connection.query(paraQuery, [id]);
    const para = paraResult[0]?.para;
    if (para) {
      const unreadCount = await getUnreadCount(para);
      io.to(para).emit("notification", unreadCount); 
    }
      return res.status(200).json({
        status: "success",
        message: "Notification updated successfully.",
      });
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

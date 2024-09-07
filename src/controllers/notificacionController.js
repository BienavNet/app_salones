import { methods as database } from "../database/database.js";
import { NotificationMessages as messages } from "../assets/notificationsMessages.js";


const sendNotification = async (req, res) => {
    try {
        if (req.body !== undefined) {
            const { mensaje, de, para } = req.body

            if (mensaje != undefined && de != undefined && para != undefined) {
                const connection = await database.getConnection()
                const result = await connection.query(
                    `INSERT INTO notificacion (mensaje, de, para, estado, fecha) 
                     VALUES (?, ?, ?, 'no leida', NOW())`,
                    [mensaje, de, para] 
                );

                const { insertId, affectedRows } = result

                if (affectedRows == 1 && insertId !== undefined) {
                    res.status(200).json({ "status": "ok", "id": insertId, "message": "Datos almacenados correctamente" })
                    return
                }
                res.status(400).json({ "status": "error", "message": "Bad request." })
                return
            }
            res.status(400).json({ "status": "error", "message": "Bad request." })
            return
        }

        res.status(400).json({ "status": "error", "message": "Bad request." })
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getNotifications = async (req, res) => {

    try {
        const { cedula, estado } = req.params;  // Cambia a req.body si estás usando el cuerpo de la solicitud
        console.log("estado: " + estado, "cedula: " + cedula);
        if (cedula === undefined || estado === undefined) {
            res.status(400).json({ status: "error", message: "Missing parameters." });
            return;
        }
        const connection = await database.getConnection()
        let query = "";
        const params = [cedula];  // Empezamos con el parámetro `cedula`

        if (estado === "todas") {
            // Consulta para todos los estados, incluyendo los nombres y apellidos de 'de' y 'para'
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
            // Consulta para un estado específico, incluyendo los nombres y apellidos de 'de' y 'para'
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
            params.push(estado);  // Añadimos `estado` a los parámetros solo si no es "todas"
        }
        const result = await connection.query(query, params);  // Ejecutamos la consulta con los parámetros
        console.log("resultado de notification", result);

        if (result.length > 0) {
            return res.status(200).json(result);
        }
        return res.status(200).json([]);
    } catch (error) {
        return res.status(500).send("Internal Server Error: " + error.message);
    }
    
    // try {
    //     if (req.body !== undefined) {
    //         const { cedula, estado } = req.params
    //      console.log("estado: " + estado, "cedula: " + cedula)

    //         let query = ""

    //         if (estado === "todas") {
    //             query = "SELECT notificacion.* FROM notificacion JOIN persona ON notificacion.para = persona.id WHERE persona.cedula = ?";
    //         } else {
    //             query = "SELECT notificacion.* FROM notificacion JOIN persona ON notificacion.para = persona.id WHERE persona.cedula = ? AND notificacion.estado = ?";
    //         }
    //         console.log("query: " + query);
    //         const result = await connection.query(query, [cedula, estado === "todas" ? undefined : estado]);
    //         console.log("resultado de notificationm", result)
    //         if (result) {
    //             return res.status(200).json(result);
    //         }
    //         return res.status(400).json({ status: "error", message: "Bad request." });
    //     }
    // } catch (error) {
    //     return res.status(500).send("Internal Server Error: " + error.message);
    // }
}

const getAll = async (req, res) => {
    try {
        const connection = await database.getConnection()
        const result = await connection.query("SELECT * FROM notificacion")
        if (result !== undefined) {
            res.status(200).json(result);
            return;
        }
        res.status(400).json({ status: "error", message: "Bad request." });
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message);
    }
}

const editNotificacion = async (req, res) =>{
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!id || !estado) {
            return res.status(400).json({ status: "error", message: "Missing parameters." });
        }
        const connection = await database.getConnection();
        const query = "UPDATE notificacion SET estado = ? WHERE id = ?";
        const result = await connection.query(query, [estado, id]);

        if (result.affectedRows > 0) {
            return res.status(200).json({ status: "success", message: "Notification updated successfully." });
        } else {
            return res.status(404).json({ status: "error", message: "Notification not found." });
        }
    } catch (error) {
        return res.status(500).send("Internal Server Error: " + error.message);
    }
}

export const methods = {
    getAll, 
    getNotifications,
    sendNotification,
    editNotificacion
}
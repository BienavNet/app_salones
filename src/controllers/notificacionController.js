import { methods as database } from "../database/database.js";
import { NotificationMessages as messages } from "../assets/notificationsMessages.js";


const sendNotification = async (req, res) => {
    try {
        if (req.body !== undefined) {
            const { mensaje, de, para } = req.body

            if (mensaje != undefined && de != undefined && para != undefined) {
                const connection = await database.getConnection()

                //revisar este metodo por la fecha
                const result = await connection.query(`INSERT INTO notificacion VALUES ('mensaje', 'de', 'para', 'estado', 'fecha') VALUES ('${mensaje}', '${de}', '${para}', 'no leida', '${new Date()}')`)

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
        if (req.body !== undefined) {
            const { cedula, estado } = req.body

            let query = ""

            if (estado == "todas")
                query = "SELECT notificacion.* FROM notificacion JOIN persona ON notificacion.para = persona.id WHERE persona.cedula = " + cedula + ""
            else
                query = "SELECT notificacion.* FROM notificacion JOIN persona ON notificacion.para = persona.id WHERE persona.cedula = " + cedula + " AND notificacion.estado = " + estado + ""

            const result = await connection.query(query)
            if (result !== undefined) {
                res.status(200).json(result);
                return;
            }
            res.status(400).json({ status: "error", message: "Bad request." });
        }
    } catch (error) {
        res.status(500).send("Internal Server Error: " + error.message);
    }
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

export const methods = {
    getAll, 
    getNotifications,
    sendNotification
}
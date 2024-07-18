import { methods as database } from "./../database/database.js"


const getDocentes = async (req, res) => {
    try {
        const connection = await database.getConnection()
        const result = await connection.query("SELECT persona.*, docente.id as docente_id FROM persona INNER JOIN docente ON persona.id = docente.persona")
        res.status(200).json(result)
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getDocenteIdByCedula = async (req, res) => {
    try {
        if (req.params !== undefined) {
            const { cedula } = req.params
            const connection = await database.getConnection()
            const result = await connection.query("SELECT docente.id as docente_id, docente.persona as persona_id FROM docente INNER JOIN persona ON persona.id = docente.persona WHERE persona.cedula = " + cedula + "")
            res.status(200).json(result)
        } else {
            res.send(400, "Bad Request")
        }
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getDocenteByCedula = async (req, res) => {
    try {
        if (req.params !== undefined) {
            const { cedula } = req.params
            const connection = await database.getConnection()
            //const result = await connection.query("SELECT p.*, d.* FROM persona as p, docente as d WHERE p.cedula = " +cedula+ " and d.persona = p.id")
            const result = await connection.query("SELECT persona.*, docente.id as docente_id FROM persona INNER JOIN docente ON persona.id = docente.persona WHERE persona.cedula = " + cedula + ";")
            res.status(200).json(result)
        } else {
            res.send(400, "Bad Request")
        }
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const saveDocente = async (req, res) => {
    try {
        res.setHeader("Content-Type", "application/json")
        if (req.body !== undefined) {
            const { nombre, apellido, cedula, correo, contrasena } = req.body

            if (typeof nombre === 'string' && typeof apellido === 'string' && typeof cedula === "number" && typeof correo === 'string' && typeof contrasena === 'string'){
                const connection = await database.getConnection()
                var result = await connection.query("INSERT INTO persona SET ?", req.body)
                if (result !== undefined) {
                    const { insertId } = result
                    result = await connection.query("INSERT INTO docente (persona) VALUES (" + insertId + ")")
                    res.status(200).json({ "status": "ok", "message": "Datos almacenados en la base de datos correctamente" })
                } else {
                    res.status(400).send("Bad Request.")
                }
                return
            }
            res.status(200).json({"status": "error", "message": "Verifica el formato de los datos."})
            return
        } else {
            res.status(400).send("Bad Request.")
        }

    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const updateDocente = async (req, res) => {
    try {
        res.setHeader("Content-Type", "application/json")

        if (req.params !== undefined) {
            const { cedula } = req.params
            if (req.body !== undefined) {
                // const { nombre, apellido, correo, contrasena } = req.body
                const connection = await database.getConnection()
                const result = await connection.query("UPDATE persona SET ? WHERE cedula = " + cedula + "", req.body)

                const { affectedRows } = result
                if (affectedRows > 0) {
                    res.status(200).json({ "status": "ok", "message": "Datos actualizados correctamente." })
                } else {
                    res.status(400).json({ "status": "bad request", "message": "No se encontro la cedula en los registros." })
                }

                return
            }
            res.status(400).send("Bad Request.")
        }
        res.status(400).send("Bad Request.")

    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const deleteDocente = async (req, res) => {
    try {
        if (req.params !== undefined) {
            const { cedula } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("DELETE docente, persona FROM docente JOIN persona ON persona.id = docente.persona WHERE persona.cedula = " + cedula + "")

            const { affectedRows } = result

            if (affectedRows > 0) {
                res.status(200).json({ "status": "ok", "message": "Datos eliminados de la base de datos." })
            } else {
                res.status(400).json({ "status": "bad request", "message": "No se encontro la cedula en los registros." })
            }
            return
        }
        res.status(400).send("Bad Request.")

    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

export const methods = {
    getDocentes,
    getDocenteIdByCedula,
    getDocenteByCedula,
    saveDocente,
    updateDocente,
    deleteDocente
}
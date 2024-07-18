import { methods as database } from "./../database/database.js"


const getSupervisores = async (req, res) => {
    try {
        const connection = await database.getConnection()
        const result = await connection.query("SELECT persona.*, supervisor.id as supervisor_id FROM persona INNER JOIN supervisor ON persona.id = supervisor.persona")
        res.status(200).json(result)
    } catch (error) {
        res.status(200).send('Internal Server Error: ' + error.message)
    }
}

const getSupervisorIdByCedula = async (req, res) => {
    try {
        if (req.params !== undefined) {
            const { cedula } = req.params
            const connection = await database.getConnection()
            const result = await connection.query("SELECT supervisor.id as supervisor_id, supervisor.persona as persona_id FROM supervisor INNER JOIN persona ON persona.id = supervisor.persona WHERE persona.cedula = " + cedula + "")
            res.status(200).json(result)
        } else {
            res.send(400, "Bad Request")
        }
    } catch (error) {
        res.status(200).send('Internal Server Error: ' + error.message)
    }
}

const getSupervisorByCedula = async (req, res) => {
    try {
        if (req.params !== undefined) {
            const { cedula } = req.params
            const connection = await database.getConnection()
            //const result = await connection.query("SELECT p.*, d.* FROM persona as p, supervisor as d WHERE p.cedula = " +cedula+ " and d.persona = p.id")
            const result = await connection.query("SELECT persona.*, supervisor.id as supervisor_id FROM persona INNER JOIN supervisor ON persona.id = supervisor.persona WHERE persona.cedula = " + cedula + ";")
            res.status(200).json(result)
        } else {
            res.send(400, "Bad Request")
        }
    } catch (error) {
        res.status(200).send('Internal Server Error: ' + error.message)
    }
}

const saveSupervisor = async (req, res) => {
    try {
        res.setHeader("Content-Type", "application/json")
        if (req.body !== undefined) {
            const { nombre, apellido, cedula, correo, contrasena } = req.body
            const persona = {
                nombre, apellido, cedula, correo, contrasena
            }
            const connection = await database.getConnection()
            var result = await connection.query("INSERT INTO persona SET ?", persona)
            console.log(result)
            if (result !== undefined) {
                const { insertId } = result
                result = await connection.query("INSERT INTO supervisor (persona) VALUES (" + insertId + ")")
                res.status(200).json({ status: "ok", message: "Datos almacenados en la base de datos correctamente" })
            } else {
                res.status(400).send("Bad Request.")
            }
            return
        } else {
            res.status(400).send("Bad Request.")
        }

    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const updateSupervisor = async (req, res) => {
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

const deleteSupervisor = async (req, res) => {
    try {
        if (req.params !== undefined) {
            const { cedula } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("DELETE supervisor, persona FROM supervisor JOIN persona ON persona.id = supervisor.persona WHERE persona.cedula = " + cedula + "")

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
    getSupervisores,
    getSupervisorIdByCedula,
    getSupervisorByCedula,
    saveSupervisor,
    updateSupervisor,
    deleteSupervisor
}
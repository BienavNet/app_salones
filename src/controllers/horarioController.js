import { methods as database } from "./../database/database.js"


const saveHorario = async (req, res) => {
    try {
        if (req.body != undefined && req.body !== ""){

            const { docente, asignatura } = req.body

            if (typeof docente === 'number' && typeof asignatura === 'string'){
                const connection = await database.getConnection()
                const result = await connection.query("INSERT INTO horario SET ?", req.body)
                console.log(result)

                const { insertId, affectedRows } = result
                
                if (affectedRows == 1 ){
                    res.status(200).json({"status": "ok", "message": "Horario almacenado correctamente.", "id": insertId})
                }
                res.status(200).json({"status": "error", "message": "Datos faltantes o incorrectos."})

                return
            }
            res.status(200).json({"status": "error", "message": "Los datos enviados no poseen el formato correcto."})
            return
        }
        res.status(200).json({"status": "error", "message": "Los datos a almacenar no pueden estar vacios."})
        return 
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const updateHorario =  async (req, res) => {
    try {
        if (req.body !== undefined && req.body !== ""){
            if (req.params !== undefined){
                const { id } = req.params

                if ( req.body !== undefined){
                    const connection = await database.getConnection()
                    const result = await connection.query("UPDATE horario SET ? WHERE id = " +id+ "")

                    const { affectedRows } = result

                    if ( affectedRows > 0 ){
                        res.status(200).json({ "status": "ok", "message": "Datos actualizados correctamente." })
                    }
                    res.status(200).json({ "status": "error", "message": "Error en los datos enviados al servidor." })
                }

                res.status(400).send("Bad request.")
            }
        }
        res.status(400).send("Bad request.")
        
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const deleteHorario = async (req, res) => {
    try {
        if (req.params !== undefined) {
            const { id } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("DELETE horario, detalle_horario, clase FROM horario JOIN detalle_horario ON horario.id = detalle_horario.horario JOIN clase ON horario.id = clase.horario WHERE horario.id = " +id+ "")

            const { affectedRows } = result

            if (affectedRows > 0) {
                res.status(200).json({ "status": "ok", "message": "Datos eliminados de la base de datos." })
            } else {
                res.status(400).json({ "status": "bad request", "message": "No se encontro el horario en los registros." })
            }
            return
        }
        res.status(400).send("Bad Request.")

    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getHorarios = async (req, res) => {
    try {
        const connection = await database.getConnection()
        const result = await connection.query("SELECT horario.id, horario.asignatura, detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin, persona.nombre, persona.apellido, persona.cedula FROM horario JOIN docente ON horario.docente = docente.id JOIN detalle_horario ON horario.id = detalle_horario.horario JOIN persona ON docente.persona = persona.id")

        if (result !== undefined){
            res.status(200).json(result)
            return
        }
        res.status(500).json({"status": "error", "message": "No se pudo obtener la informacion de la base de datos."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getHorarioById = async (req, res) => {
    try {
        if ( res.params !== undefined) {
            const { id } = res.params
            const connection = await database.getConnection() 
            const result = await connection.query("SELECT * FROM horario WHERE id = " +id+ "")
            res.status(200).json(result)
            return
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
        
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getHorariosByDocente = async (req, res) => {
    try {
        if ( req.params !== undefined ){
            const { cedula } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("SELECT horario.id, horario.asignatura, detalle_horario.dia, detalle_horario.hora_inicio, detalle_horario.hora_fin FROM horario JOIN docente ON horario.docente = docente.id JOIN persona ON docente.persona = persona.id JOIN detalle_horario ON horario.id = detalle_horario.horario WHERE persona.cedula = " +cedula+ "")

            res.status(200).json(result)
            return 
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

export const methods = {
    saveHorario,
    updateHorario,
    deleteHorario,
    getHorarios,
    getHorarioById,
    getHorariosByDocente
}

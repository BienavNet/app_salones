import { methods as database } from "./../database/database.js"

const getComentarioById = async (req, res) => {
    try {
        if ( req.params !== undefined) {
            const { id } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("SELECT * FROM comentario WHERE id = " +id+ "")

            if (result !== undefined) {
                res.status(200).json(result)
                return
            }
            res.status(400).json({"status": "error", "message": "Bad request."})
            return
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getComentarioByDocente = async (req, res) => {
    try {
        if (req.params !== undefined){
            const { cedula } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("SELECT comentario.* FROM comentario JOIN salon on salon.id = comentario.salon JOIN docente ON docente.id = comentario.docente JOIN persona ON persona.id = docente.persona WHERE persona.cedula = " +cedula+ "")

            if ( result !== undefined) {
                res.status(200).json(result)
                return
            }
            res.status(400).json({"status": "error", "message": "Bad request."})
            return
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getComentarioBySalon = async (req, res) => {
    try {
        if ( req.params !== undefined){
            const { salon } = req.params 

            const connection = await database.getConnection()
            const result = await connection.query("SELECT comentario.* FROM comentario JOIN salon on salon.id = comentario.salon WHERE salon.id = " +salon+ "")

            if ( result !== undefined) {
                res.status(200).json(result)
                return
            }
            res.status(400).json({"status": "error", "message": "Bad request."})
            return
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getAllComentarios = async (req, res) => {
    try {
        const connection = await database.getConnection()
        const result = await connection.query("SELECT * FROM comentario")

        if (result!==undefined){
            res.status(200).json(result)
            return
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const registerComentario = async (req, res) => {
    try {
        if ( req.body !== undefined) {
            const { comentario, docente, salon } = req.body

            if (comentario!==undefined && docente!==undefined && salon!==undefined){
                const connection = await database.getConnection()
                const result = await connection.query("INSERT INTO comentario SET ?", req.body)
                const { insertId, affectedRows } = result

                if (affectedRows == 1 && insertId !== undefined){
                    res.status(200).json({"status": "ok", "id": insertId, "message": "Datos almacenados correctamente"})
                    return 
                }
                res.status(400).json({"status": "error", "message": "Bad request."})
                return
            }
            res.status(400).json({"status": "error", "message": "Bad request."})
            return
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const deleteComentarioById = async (req, res) => {
    try {
        if (req.params !== undefined){
            const { id } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("DELETE FROM comentario WHERE id = " +id+ "")

            const { affectedRows } = result

            if ( affectedRows!==1 ){
                res.status(200).json({"status": "ok", "message": "Datos eliminados del servidor."})
                return
            }
            res.status(400).json({"status": "error", "message": "Bad request."})
            return 
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const deleteComentarioByDocente = async (req, res) => {
    try {
        if ( req.params !== undefined){
            const { cedula } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("DELETE comentario FROM comentario JOIN docente ON docente.id = comentario.docente JOIN persona ON docente.persona = persona.id WHERE persona.cedula = " +cedula+ "")

            const { affectedRows } = result

            if (affectedRows==1){
                res.status(200).json({"status": "ok", "message": "Datos eliminados del servidor."})
                return
            }
            res.status(400).json({"status": "error", "message": "Bad request."})
            return
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

export const methods = {
    getComentarioById,
    getComentarioByDocente,
    getComentarioBySalon,
    getAllComentarios,
    registerComentario,
    deleteComentarioById,
    deleteComentarioByDocente
}
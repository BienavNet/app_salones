import { connection } from "./../database/database.js"


// Obtiene todos los registros de la tabla categoria_salon
const categorySalonID = async (req, res) => {
    try {    
        const [result] = await connection.query("SELECT * FROM categoria_salon")
        if (result.length > 0){
            return res.status(200).json(result)
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

// Obtiene los registros de la tabla salon si el id pasado coincide con algun registro
const getSalonById = async (req, res) => {
    try {
        if (req.params !== undefined){
            const { id } = req.params
            const [result] = await connection.query(
                `
            SELECT salon.*,
            categoria_salon.categoria 
            FROM salon 
            JOIN categoria_salon ON salon.categoria_salon = categoria_salon.id
            WHERE salon.id = ?
                `, [id])
            if ( result.length > 0) {
                return res.status(200).json(result)
            }
            return res.status(404).json({"status": "error", "message": "Classroom is missing ID."})
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

const getSalonId = async (req, res) => {
    try {
        if (req.params !== undefined){
            const { number } = req.params
            const [result] = await connection.query(
                `
            SELECT id as salon_id
            FROM salon 
            WHERE numero_salon = ?
                `, [number])
            if ( result.length > 0) {
                return res.status(200).json(result)
            }
            return res.status(404).json({"status": "error", "message": "Classroom is missing ID."})
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}


// Obtiene todos los registros de la tabla salon
const getSalones = async (req, res) => {
    try {
        const [result] = await connection.query("SELECT * FROM salon")
        if (result.length > 0){
            return res.status(200).json(result);
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}


// Actualiza un registro preexistente de la tabla salon
const updateSalon = async (req, res) => {
    try {
        if ( req.params !== undefined && req.body !== undefined){
            const { id } = req.params      
            const [result] = await connection.query("UPDATE salon SET ? WHERE id = " +id+ "", req.body)
            const { affectedRows } = result
            if ( affectedRows == 1 ){
                return res.status(200).json({"status": "ok", "message": "Datos actualizados correctamente."})  
            }
            return res.status(404).json({"status": "error", "message": "Bad request."})
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

export const methods = {
    getSalonById,
    getSalonId,
    getSalones,
    updateSalon, 
    categorySalonID
}
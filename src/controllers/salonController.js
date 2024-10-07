import { connection } from "./../database/database.js"

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
    getSalones,
    updateSalon, 
    categorySalonID
}
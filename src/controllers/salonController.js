import { methods as database } from "./../database/database.js"

const getSalonById = async (req, res) => {
    try {
        if (req.params !== undefined){
            const { id } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("SELECT * FROM salon WHERE id = " +id+ "")

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

const getSalones = async (req, res) => {
    try {
        const connection = await database.getConnection()
        const result = await connection.query("SELECT * FROM salon")
        console.log("result the salon", result)
        if (result !== undefined){
            res.status(200).json(result)
            return
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

            const connection = await database.getConnection()
            const result = await connection.query("UPDATE salon SET ? WHERE id = " +id+ "", req.body)

            const { affectedRows } = result

            if ( affectedRows == 1 ){
                res.status(200).json({"status": "ok", "message": "Datos actualizados correctamente."})
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
    getSalonById,
    getSalones,
    updateSalon
}
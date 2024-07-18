import { methods as database } from "./../database/database.js"


const getReportes = async (req, res)=> {
    try {
        const connection = await database.getConnection()
        const result  = await connection.query("SELECT * FROM reporte")

        if (result!==undefined){
            res.status(200).json(result)
            return
        }
        res.status(400).json({"status": "error", "message": "Bad request."})
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}


const getReporteBySupervisor = async (req, res) => {
    try {
        if (req.params!==undefined){
            const {id} = req.params

            const connection = await database.getConnection()
            const result  = await connection.query("SELECT reporte.* FROM reporte JOIN clase ON clase.id = reporte.clase WHERE clase.supervisor = " +id+ " ")

            if (result!==undefined){
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

const getReporteByClase = async (req, res) => {
    try {
        if (req.params!==undefined){
            const {clase} = req.params

            const connection = await database.getConnection()
            const result  = await connection.query("SELECT reporte.* FROM reporte WHERE reporte.clase = " +clase+ " ")

            if (result!==undefined){
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

const getReporteBySalon = async (req, res) => {
    try {
        if (req.params!==undefined){
            const {salon} = req.params

            const connection = await database.getConnection()
            const result  = await connection.query("SELECT reporte.* FROM reporte JOIN clase ON clase.id = reporte.clase WHERE clase.salon = " +salon+ " ")

            if (result!==undefined){
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

const registrarReporte = async (req, res) => {
    try {
        if ( req.body !== undefined){

            const { clase, comentario } = req.body

            if (clase!==undefined && comentario!==undefined){
                const connection = await database.getConnection()
                const result = await connection.query("INSERT INTO reporte SET ?", req.body)

                const { affectedRows } = result

                if (affectedRows == 1){
                    res.status(200).json({"status": "ok", "message": "Datos almacenados correctamente en el servidor."})
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

const deleteReporte = async (req, res) => {
    try {
        if (req.params!==undefined){
            const { id } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("DELETE reporte WHERE reporte.id = " +id+ "")

            const { affectedRows } = result

            if (affectedRows == 1){
                res.status(200).json({"status": "ok", "message": "Datos eliminados correctamente en el servidor."})
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

const updateReporte = async (req, res) => {
    try {
        if ( req.params !== undefined && req.body!==undefined){
            const { id } = req.params

            const connection = await database.getConnection()
            const result = await connection.query("UPDATE reporte SET ? WHERE reporte.id = " +id+ "")
            const { affectedRows } = result

            if (affectedRows == 1){
                res.status(200).json({"status": "ok", "message": "Datos actualizados correctamente en el servidor."})
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
    getReportes,
    getReporteByClase,
    getReporteBySalon,
    getReporteBySupervisor,
    registrarReporte,
    updateReporte,
    deleteReporte
}
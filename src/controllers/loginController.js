import { methods as database } from "./../database/database.js";


const checkLogin = async (req, res) => {
    try {
        if (req.body !== undefined && req.body !== ""){
            const { correo, contrasena, rol } = req.body

            if (correo !== "" && contrasena !== "" && rol !== ""){
                const connection = await database.getConnection()
                var result = await connection.query("SELECT id FROM persona WHERE correo = '" +correo+ "' AND contrasena = '" +contrasena+ "'")
                const { id } = result[0]

                if (id !== undefined && id !== ""){
                    var result = await connection.query("SELECT id AS id_rol FROM " +rol+ " WHERE persona = " +id+ "")
                    if (result.length >0 ){
                        const { id_rol } = result[0]
                        if ( id_rol !== undefined && id_rol !== ""){
                            res.status(200).json({"status": "ok", "message": "Login Correcto.!"})
                            return
                        }
                    }
                    res.status(200).json({"status": "error", "message": "Error al determinar el rol."})
                    return
                }
                res.status(200).json({"status": "error", "message": "Credenciales incorrectas."})
                return
            }else{
                res.status(400).json({"status": "error", "message": "Revisa que los campos no esten vacios."})
            }
            res.status(400).json({"status": "error", "message": "El cuerpo de la peticion no puede estar vacia."})
            return
        }
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

export const methods = {
    checkLogin
}
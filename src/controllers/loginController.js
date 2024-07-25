import { methods as database } from "./../database/database.js";
import { tokensMethods as tokens } from "./../functions.js";




const checkLogin = async (req, res) => {
    try {
        if (req.body !== undefined && req.body !== "") {
            const { correo, contrasena, rol } = req.body
            // const { access_token } = req.cookies


            // // se verifica con las cookies que el usuario trata de loggear o al menos de cargar la pagina de login
            // // si las cookies existen las validan y redireccionan al rol correspondiente
            // if (typeof access_token !== "undefined"){
            //     const data_decoded = tokens.verifyToken(access_token)
            //     if (typeof data_decoded !== "undefined"){
            //         const { user, rol } = data_decoded
            //         if (typeof user !== "undefined" && typeof rol !== "undefined"){
            //             res.set({
            //                 "Authorization": access_token
            //             })
            //             res.status(200).json({ "status": "ok", "message": "Login Correcto.!"})
            //             return
            //         }
            //     }
                    

            // }

            if (correo !== "" && contrasena !== "" && rol !== "") {
                const connection = await database.getConnection()
                var result = await connection.query("SELECT id FROM persona WHERE correo = '" + correo + "' AND contrasena = '" + contrasena + "'")
                const { id } = result[0]

                if (id !== undefined && id !== "") {
                    var result = await connection.query("SELECT id AS id_rol FROM " + rol + " WHERE persona = " + id + "")
                    if (result.length > 0) {
                        const { id_rol } = result[0]
                        if (id_rol !== undefined && id_rol !== "") {
                            const token = tokens.signToken({ user: correo, rol: rol })
                            res.set({
                                "Authorization": token
                            })
                            res.cookie("access_token", token, {
                                httpOnly: true, // la cookie solo se puede acceder en el servidor
                                // secure: process.env.NODE_ENV === 'production', // solo en el entorno de producción, la cookie solo se puede acceder desde https
                                sameSite: 'strict', // la cookie solo se puede acceder en el mismo dominio
                                maxAge: 1000 * 60 * 60 // la cookie tiene tiempo de valides de solo 1 hora
                            })
                            res.status(200).json({ "status": "ok", "message": "Login Correcto.!", "token": token })
                            return
                        }
                    }
                    res.status(200).json({ "status": "error", "message": "Error al determinar el rol." })
                    return
                }
                res.status(200).json({ "status": "error", "message": "Credenciales incorrectas." })
                return
            } else {
                res.status(400).json({ "status": "error", "message": "Revisa que los campos no esten vacios." })
            }
            res.status(400).json({ "status": "error", "message": "El cuerpo de la peticion no puede estar vacia." })
            return
        }
    } catch (error) {
        res.status(500).send('Internal Server Error: ' + error.message)
    }
}

export const methods = {
    checkLogin
}
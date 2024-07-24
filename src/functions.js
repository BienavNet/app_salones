import jwt from "jsonwebtoken"
import config from "./config.js";

//Registra un nuevo token
const signToken = (payload) => {
    try {
        const token = jwt.sign(payload, config.JWT_SECRET_KEY, {
            expiresIn: '1h'
        })
        return token
    } catch (error) {
        throw new Error("Error al obtener el token: " + error.message)
    }
}


//desencripta el token pasado
const verifyToken = (token) => {
    try {
        const token_decoded = jwt.verify(token, config.JWT_SECRET_KEY)
        if (token_decoded) {
            return token_decoded
        }
        return "Bad token"
    } catch (error) {
        
        if (typeof error.message === "string" && error.message === "jwt expired")
            return "token expired"
        throw new Error("Error al obtener el token: " + error.message)
    }
}

export const tokensMethods = {
    signToken,
    verifyToken
}
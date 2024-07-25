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

const isAuthorized = (router, roles) =>{
    router.use((req, res, next) => {
        const token = req.get("Authorization")
        var access_token = undefined
    
        if (typeof token !== "undefined"){
            access_token = token
        }else{
            access_token = req.cookies.access_token
        }
    
        if (typeof access_token !== "undefined"){
            const token_decoded = verifyToken(access_token)
            if (typeof token_decoded !== "undefined" && access_token !== "token expired"){
                const { user, rol } = token_decoded
                if (typeof user !== "undefined" && typeof rol !== "undefined"){
                    const getRole = roles.find((item)=> item == rol)
                    if (typeof getRole !== "undefined"){
                        next()
                        return
                    }
                }
            }else{
                res.status(401).send("Your token has expired. Please just re-log in and try again.")
                return 
            }
        } 
        res.status(403).send("You are not allowed to do this.")
    })
}

export const tokensMethods = {
    signToken,
    verifyToken,
    isAuthorized
}
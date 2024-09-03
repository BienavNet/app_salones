import jwt from "jsonwebtoken"
import config from "./config.js";

//Registra un nuevo token
const signToken = (payload) => {
    try {
        const token = jwt.sign(
            payload, 
            config.JWT_SECRET_KEY, {
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

// valida el token y verifica los roles permitidos para acceder a ciertas rutas
const isAuthorized = (router, roles) =>{
    router.use((req, res, next) => {
        const token = req.get("Authorization")
        let access_token;
        if (token && token.startsWith('Bearer ')) {
            access_token = token.split(' ')[1]  // extrae el token sin el prefijo "Bearer"
        }
        else{ access_token = req.cookies.access_token}
    
        if (access_token){
            const token_decoded = verifyToken(access_token)
            if (token_decoded !== "token expired" && token_decoded !== "Bad token"){
                const { user, rol } = token_decoded
                if (typeof user !== "undefined" && typeof rol !== "undefined"){
                    const getRole = roles.find((item)=> item == rol)
                    if (typeof getRole !== "undefined"){
                        next()
                        return
                    }
                }
            }else{
                return  res.status(401).send("Your token has expired. Please just re-log in and try again.")
            }
        } 
        return res.status(403).send("You are not allowed to do this.")
    })
}

const checkSession = (req, res) => {
    const token = req.cookies.access_token;
    if (!token) {
        return res.status(401).json({ status: "Unauthorized", message: "No token provided." });
    }
    try {
        const decoded = verifyToken(token);
        return res.status(200).json({ status: "ok", user: decoded });
    } catch (error) {
        return res.status(401).json({ status: "Unauthorized", message: "Invalid token." });
    }
};

export const tokensMethods = {
    signToken,
    verifyToken,
    isAuthorized,
    checkSession,
}
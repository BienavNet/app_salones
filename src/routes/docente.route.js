import { Router } from "express";
import { methods as docenteMethods} from "./../controllers/docenteController.js"
import { tokensMethods } from "../functions.js";
import { methods } from "../database/database.js";


const router = Router();

const isAuthorized = () =>{
}


try {
    
    router.use((req, res, next) => {
        const token = req.get("Authorization")
        var access_token = undefined
    
        if (typeof token !== "undefined"){
            access_token = token
        }else{
            access_token = req.cookies.access_token
        }
    
        if (typeof access_token !== "undefined"){
            const token_decoded = tokensMethods.verifyToken(access_token)
            if (typeof token_decoded !== "undefined" && access_token !== "token expired"){
                const { user, rol } = token_decoded
                if (typeof user !== "undefined" && typeof rol !== "undefined"){
                    if (rol == "docente"){
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

    router.get("/", docenteMethods.getDocentes)
    
    router.get("/:cedula", docenteMethods.getDocenteIdByCedula)
    
    router.get('/cedula/:cedula', docenteMethods.getDocenteByCedula)
    
    router.post("/save", docenteMethods.saveDocente)
    
    // router.post("/login", docenteMethods.loginDocente)
    
    // router.get("/protected", docenteMethods.protectedHome)
    
    router.post("/update/:cedula", docenteMethods.updateDocente)
    
    router.delete('/delete/:cedula', docenteMethods.deleteDocente)


    // router.use((req, res) => {
    //     try {
    //       res.status(403).send("You are not allowed to do this.")
    //     } catch (error) {
    //       res.status(500).send("Internal Server Error: " + error.message);
    //     }
    // })
    
} catch (error) {
    
}


export default router;
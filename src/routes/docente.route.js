import { Router } from "express";
import { methods as docenteMethods } from "./../controllers/docenteController.js"
import { tokensMethods } from "../functions.js";


const router = Router();


try {

    tokensMethods.isAuthorized(router, ["docente", "administrador"])
    router.get('/cedula/:cedula', docenteMethods.getDocenteByCedula)

    tokensMethods.isAuthorized(router, ["administrador"])
    router.get("/", docenteMethods.getDocentes)
    router.get("/:cedula", docenteMethods.getDocenteIdByCedula)
    router.post("/save", docenteMethods.saveDocente)
    router.post("/update/:cedula", docenteMethods.updateDocente)
    router.delete('/delete/:cedula', docenteMethods.deleteDocente)

} catch (error) {
    console.log(error.message)
}


export default router;
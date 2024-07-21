import { Router } from "express";
import { methods as docenteMethods} from "./../controllers/docenteController.js"


const router = Router();

router.get("/", docenteMethods.getDocentes)

router.get("/:cedula", docenteMethods.getDocenteIdByCedula)

router.get('/cedula/:cedula', docenteMethods.getDocenteByCedula)

router.post("/save", docenteMethods.saveDocente)

router.post("/login", docenteMethods.loginDocente)

router.post("/update/:cedula", docenteMethods.updateDocente)

router.delete('/delete/:cedula', docenteMethods.deleteDocente)

export default router;
import { Router } from "express";
import { methods as horarioMethods} from "./../controllers/horarioController.js"
import { tokensMethods } from "../functions.js";

const router = Router()

tokensMethods.isAuthorized(router, ["docente", "administrador"])
router.get("/:cedula", horarioMethods.getHorariosByDocente)

tokensMethods.isAuthorized(router, ["administrador"])
router.get("/:id", horarioMethods.getHorarioById)
router.get("/", horarioMethods.getHorarios)
router.post("/update/:id", horarioMethods.updateHorario)
router.delete("/detele/:id", horarioMethods.deleteHorario)
router.post("/save", horarioMethods.saveHorario)

export default router;

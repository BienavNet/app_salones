import { Router } from "express";
import { methods as horarioMethods} from "./../controllers/horarioController.js"


const router = Router()


router.get("/:id", horarioMethods.getHorarioById)

router.get("/:cedula", horarioMethods.getHorariosByDocente)

router.get("/", horarioMethods.getHorarios)

router.post("/update/:id", horarioMethods.updateHorario)

router.delete("/detele/:id", horarioMethods.deleteHorario)

router.post("/save", horarioMethods.saveHorario)

export default router;

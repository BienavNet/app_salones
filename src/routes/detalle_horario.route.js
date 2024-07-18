import { Router } from "express";
import { methods as detalle_horarioMethods} from "./../controllers/detalleHorarioController.js"

const router = Router();

router.get("/:id", detalle_horarioMethods.getDetalleHorarioById)
router.get("/docente/:cedula", detalle_horarioMethods.getDetallesHorarioByDocente)
router.get("/horario/:horario", detalle_horarioMethods.getDetallesHorariosByHorario)
router.get("/", detalle_horarioMethods.getAllDetallesHorario)
router.post("/save", detalle_horarioMethods.saveDetalleHorario)
router.get("/delete/:id", detalle_horarioMethods.deleteDetalleHorario)
router.post("/update/:id", detalle_horarioMethods.updateDetalleHorario)

export default router
import { Router } from "express";
import { methods as detalle_horarioMethods} from "./../controllers/detalleHorarioController.js"
import { tokensMethods } from "../functions.js";

const router = Router();

tokensMethods.isAuthorized(router, ["director", "docente"])
router.get("/docente/:cedula", detalle_horarioMethods.getDetallesHorarioByDocente)
router.get("/horario/:horario", detalle_horarioMethods.getDetallesHorariosByHorario)

tokensMethods.isAuthorized(router, ["director"])
router.get("/:id", detalle_horarioMethods.getDetalleHorarioById) // ✅
router.get("/timetable/:id", detalle_horarioMethods.getDetalleHorariosByHorarioId) // ✅
router.get("/", detalle_horarioMethods.getAllDetallesHorario)  // ✅
router.post("/save", detalle_horarioMethods.saveDetalleHorario) // ✅
router.delete("/delete/:id", detalle_horarioMethods.deleteDetalleHorario) // ✅
router.patch("/update/:id", detalle_horarioMethods.updateDetalleHorario)

export default router
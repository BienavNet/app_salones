import { Router } from "express";
import { methods as detalle_horarioMethods} from "./../controllers/detalleHorarioController.js"
import { tokensMethods } from "../functions.js";

const router = Router();
// Consultamos si el token que realizo la peticion esta autorizado como cualquiera de los 2 roles
tokensMethods.isAuthorized(router, ["docente","director"])
// Se consulta el cotrolador detalle_hoario, el metodo getDetallesHorarioByDocente 
router.get("/docente/:cedula", detalle_horarioMethods.getDetallesHorarioByDocente)
// Se consulta el cotrolador detalle_hoario, el metodo getDetallesHorariosByHorario 
router.get("/horario2/:horario", detalle_horarioMethods.getDetallesHorariosByHorario)
// Se consulta el cotrolador detalle_hoario, el metodo filterByDay 
router.get("/docente/:cedula/dia/:dia", detalle_horarioMethods.filterByDay)

// Consultamos si el token que realizo la peticion esta autorizado como director
tokensMethods.isAuthorized(router, ["director"])
// Se consulta el cotrolador detalle_hoario, el metodo getDetalleHorarioById 
router.get("/:id", detalle_horarioMethods.getDetalleHorarioById)
// Se consulta el cotrolador detalle_hoario, el metodo getDetalleHorariosByHorarioId 
router.get("/timetable/:id", detalle_horarioMethods.getDetalleHorariosByHorarioId)
// Se consulta el cotrolador detalle_hoario, el metodo getAllDetallesHorario 
router.get("/", detalle_horarioMethods.getAllDetallesHorario)
// Se consulta el cotrolador detalle_hoario, el metodo saveDetalleHorario 
router.post("/save", detalle_horarioMethods.saveDetalleHorario)
// Se consulta el cotrolador detalle_hoario, el metodo deleteDetalleHorario 
router.delete("/delete/:id", detalle_horarioMethods.deleteDetalleHorario)
// Se consulta el cotrolador detalle_hoario, el metodo updateDetalleHorario 
router.patch("/update/:id", detalle_horarioMethods.updateDetalleHorario)

export default router
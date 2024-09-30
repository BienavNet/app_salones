import { Router } from "express";
import { methods as claseMethods} from "./../controllers/claseController.js"
import { tokensMethods } from "../functions.js";
const router = Router();
//agg filtro por docente
tokensMethods.isAuthorized(router, ["supervisor", "docente", "director"])
router.get("/horario/:horario", claseMethods.getClaseByHorario)  //👀 //docente, opcional  director
router.get("/salon/:salon", claseMethods.getClaseBySalon)  //👀 /docente , opcional  director
router.get("/supervisor/:cedula/salon/:salon/dia/:dia/horario/:horario", claseMethods.filterBySupSalDiaHor)  //👀 //supervisor, clases por supervisor en director

tokensMethods.isAuthorized(router, ["supervisor", "director"])
router.get("/supervisor/:cedula", claseMethods.getClaseBySupervisor) // ✅  // SUPERVISOR ID LOGIN
router.get("/docente/:cedula", claseMethods.filterByDoc)
router.get("/docente/:cedula/fecha/:fecha", claseMethods.filterByDate)

tokensMethods.isAuthorized(router, ["director"])
router.get("/", claseMethods.getClases)  // ✅
router.post("/register", claseMethods.registerClase) // ✅
router.get("/:id", claseMethods.getIdClase) // pendiente
router.get("/timetable/:id", claseMethods.getClassHorarioId) // ✅
router.delete("/delete/:id", claseMethods.deleteClase) // ✅
router.patch("/update/:id", claseMethods.updateClase) // ⏱️



export default router
import { Router } from "express";
import { methods as claseMethods} from "./../controllers/claseController.js"
import { tokensMethods } from "../functions.js";
const router = Router();
//agg filtro por docente
tokensMethods.isAuthorized(router, ["supervisor", "docente", "director"])
router.get("/horario/:horario", claseMethods.getClaseByHorario)  //👀
router.get("/salon/:salon", claseMethods.getClaseBySalon)  //👀
router.get("/supervisor/:cedula/salon/:salon/dia/:dia/horario/:horario", claseMethods.filterBySupSalDiaHor)  //👀
tokensMethods.isAuthorized(router, ["supervisor", "director"])
router.get("/supervisor/:cedula", claseMethods.getClaseBySupervisor) // SUPERVISOR ID LOGIN  //👀

tokensMethods.isAuthorized(router, ["director"])
router.get("/", claseMethods.getClases)  // ✅
router.post("/register", claseMethods.registerClase) // ✅
router.get("/:id", claseMethods.getIdClase) // pendiente
router.get("/timetable/:id", claseMethods.getClassHorarioId) // ✅
router.delete("/delete/:id", claseMethods.deleteClase) // ✅
router.patch("/update/:id", claseMethods.updateClase) // ⏱️


export default router
import { Router } from "express";
import { methods as claseMethods} from "./../controllers/claseController.js"
import { tokensMethods } from "../functions.js";


const router = Router();

tokensMethods.isAuthorized(router, ["supervisor", "docente", "director"])
router.get("/horario/:horario", claseMethods.getClaseByHorario)
router.get("/salon/:salon", claseMethods.getClaseBySalon)

tokensMethods.isAuthorized(router, ["supervisor", "director"])
router.get("/supervisor/:cedula", claseMethods.getClaseBySupervisor)

tokensMethods.isAuthorized(router, ["director"])
router.get("/", claseMethods.getClases) 
router.post("/register", claseMethods.registerClase) // ✅
router.get("/:id", claseMethods.getIdClase)
router.get("/timetable/:id", claseMethods.getClassHorarioId) // ✅
router.delete("/delete/:id", claseMethods.deleteClase) // ✅
router.patch("/update/:id", claseMethods.updateClase)


export default router
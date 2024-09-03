import { Router } from "express";
import { methods as claseMethods} from "./../controllers/claseController.js"
import { tokensMethods } from "../functions.js";


const router = Router();

tokensMethods.isAuthorized(router, ["supervisor", "docente", "director"])
<<<<<<< HEAD
router.get("/horario/:horario", claseMethods.getClaseByHorario)
router.get("/salon/:salon", claseMethods.getClaseBySalon)
router.get("/supervisor/:cedula/salon/:salon/dia/:dia/horario/:horario", claseMethods.filterBySupSalDiaHor)

=======
router.get("/horario/:horario", claseMethods.getClaseByHorario) //👀  // DIRECTOR OPCIONAL
router.get("/salon/:salon", claseMethods.getClaseBySalon) //👀      // DIRECTOR OPCIONAL
 
>>>>>>> b05d0487503b6f332c9d6b4d87ee60a955302477
tokensMethods.isAuthorized(router, ["supervisor", "director"])
router.get("/supervisor/:cedula", claseMethods.getClaseBySupervisor) // SUPERVISOR ID LOGIN

tokensMethods.isAuthorized(router, ["director"])
router.get("/", claseMethods.getClases) 
router.post("/register", claseMethods.registerClase) // ✅
router.get("/:id", claseMethods.getIdClase) // pendiente
router.get("/timetable/:id", claseMethods.getClassHorarioId) // ✅
router.delete("/delete/:id", claseMethods.deleteClase) // ✅
router.patch("/update/:id", claseMethods.updateClase) // ⏱️


export default router
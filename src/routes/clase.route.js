import { Router } from "express";
import { methods as claseMethods} from "./../controllers/claseController.js"
import { tokensMethods } from "../functions.js";


const router = Router();

tokensMethods.isAuthorized(router, ["supervisor", "docente", "director"])
router.get("/horario/:horario", claseMethods.getClaseByHorario)
router.get("/salon/:salon", claseMethods.getClaseBySalon)

tokensMethods.isAuthorized(router, ["supervisor", "director"])
router.get("/supervisor/:cedula", claseMethods.getClaseBySupervisor)
router.get("/", claseMethods.getClases)

tokensMethods.isAuthorized(router, ["director"])
router.post("/register", claseMethods.registerClase)
router.delete("/delete/:id", claseMethods.deleteClase)
router.post("/update/:id", claseMethods.updateClase)


export default router
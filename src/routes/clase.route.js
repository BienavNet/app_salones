import { Router } from "express";
import { methods as claseMethods} from "./../controllers/claseController.js"
import { tokensMethods } from "../functions.js";


const router = Router();

tokensMethods.isAuthorized(router, ["supervisor", "docente", "administrador"])
router.get("/horario/:horario", claseMethods.getClaseByHorario)
router.get("/salon/:salon", claseMethods.getClaseBySalon)

tokensMethods.isAuthorized(router, ["supervisor", "administrador"])
router.get("/supervisor/:cedula", claseMethods.getClaseBySupervisor)
router.get("/", claseMethods.getClases)

tokensMethods.isAuthorized(router, ["administrador"])
router.post("/register", claseMethods.registerClase)
router.delete("/delete/:id", claseMethods.deleteClase)
router.post("/update/:id", claseMethods.updateClase)


export default router
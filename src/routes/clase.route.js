import { Router } from "express";
import { methods as claseMethods} from "./../controllers/claseController.js"


const router = Router();

router.get("/", claseMethods.getClases)
router.get("/supervisor/:cedula", claseMethods.getClaseBySupervisor)
router.get("/horario/:horario", claseMethods.getClaseByHorario)
router.get("/salon/:salon", claseMethods.getClaseBySalon)
router.post("/register", claseMethods.registerClase)
router.delete("/delete/:id", claseMethods.deleteClase)
router.post("/update/:id", claseMethods.updateClase)


export default router
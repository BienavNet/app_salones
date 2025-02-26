import { Router } from "express";
import { methods as salonMethods} from "./../controllers/salonController.js"
import { tokensMethods } from "../functions.js";

const router = Router();

// Consultamos si el token que realizo la peticion esta autorizado como cualquiera de los 2 roles
tokensMethods.isAuthorized(router, ["director", "supervisor", "docente"])
router.get("/", salonMethods.getSalones)

// Consultamos si el token que realizo la peticion esta autorizado como director
tokensMethods.isAuthorized(router, ["director"])
// Se consulta el cotrolador salon, el metodo getSalonById 
router.get("/:id", salonMethods.getSalonById)

// Se consulta el controlador salon, el metodo getSalonId
router.get("/salon/:number", salonMethods.getSalonId)

// Se consulta el cotrolador salon, el metodo updateSalon 
router.patch("/update/:id", salonMethods.updateSalon)

// Se consulta el cotrolador salon, el metodo categorySalonID 
router.get("/categoria-salon/salon", salonMethods.categorySalonID)


export default router


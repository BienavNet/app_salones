import { Router } from "express";
import { methods as notificacionMethod} from "./../controllers/notificacionController.js"
import { tokensMethods } from "../functions.js";

const router = Router()


// Consultamos si el token que realizo la peticion esta autorizado como cualquiera de los 3 roles
tokensMethods.isAuthorized(router, ["docente", "supervisor", "director"])

// Se consulta el cotrolador notificacion, el metodo getAll 
router.get("/", notificacionMethod.getAll) 

// Se consulta el cotrolador notificacion, el metodo getNotifications 
router.get("/obtener/:cedula/:estado", notificacionMethod.getNotifications)

// Se consulta el cotrolador notificacion, el metodo sendNotification 
router.post("/guardar", notificacionMethod.sendNotification) 

// Se consulta el cotrolador notificacion, el metodo editNotificacion 
router.patch("/:id", notificacionMethod.editNotificacion)
export default router

import { Router } from "express";
import { methods as notificacionMethod} from "./../controllers/notificacionController.js"
import { tokensMethods } from "../functions.js";

const router = Router()

tokensMethods.isAuthorized(router, ["docente", "supervisor", "director"])
router.get("/", notificacionMethod.getAll)
router.get("/obtener", notificacionMethod.getNotifications)
router.post("/guardar", notificacionMethod.sendNotification)

export default router

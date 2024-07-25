import { Router } from "express";
import { methods as supervisorMethods} from "./../controllers/supervisorController.js"
import { tokensMethods } from "../functions.js";


const router = Router();

tokensMethods.isAuthorized(router, ["administrador", "supervisor"])
router.get('/cedula/:cedula', supervisorMethods.getSupervisorByCedula)

tokensMethods.isAuthorized(router, ["adminsitrador"])
router.get("/", supervisorMethods.getSupervisores)
router.get("/:cedula", supervisorMethods.getSupervisorIdByCedula)
router.post("/save", supervisorMethods.saveSupervisor)
router.post("/update/:cedula", supervisorMethods.updateSupervisor)
router.delete('/delete/:cedula', supervisorMethods.deleteSupervisor)

export default router;
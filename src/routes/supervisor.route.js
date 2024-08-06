import { Router } from "express";
import { methods as supervisorMethods} from "./../controllers/supervisorController.js"
import { tokensMethods } from "../functions.js";


const router = Router();

tokensMethods.isAuthorized(router, ["director", "supervisor"])
router.get('/cedula/:cedula', supervisorMethods.getSupervisorByCedula)

tokensMethods.isAuthorized(router, ["director"])
router.get("/", supervisorMethods.getSupervisores)
router.get("/:cedula", supervisorMethods.getSupervisorIdByCedula)
router.post("/save", supervisorMethods.saveSupervisor)
router.patch("/update/:cedula", supervisorMethods.updateSupervisor)
router.delete('/delete/:cedula', supervisorMethods.deleteSupervisor)

export default router;
import { Router } from "express";
import { methods as supervisorMethods} from "./../controllers/supervisorController.js"


const router = Router();

router.get("/", supervisorMethods.getSupervisores)

router.get("/:cedula", supervisorMethods.getSupervisorIdByCedula)

router.get('/cedula/:cedula', supervisorMethods.getSupervisorByCedula)

router.post("/save", supervisorMethods.saveSupervisor)

router.post("/update/:cedula", supervisorMethods.updateSupervisor)

router.get('/delete/:cedula', supervisorMethods.deleteSupervisor)

export default router;
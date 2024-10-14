import { Router } from "express";
import { methods as supervisorMethods } from "./../controllers/supervisorController.js";
import { tokensMethods } from "../functions.js";

const router = Router();

// Consultamos si el token que realizo la peticion esta autorizado como cualquiera de los 2 roles
tokensMethods.isAuthorized(router, ["director", "supervisor"]);

// Se consulta el cotrolador supervisor, el metodo getSupervisores 
router.get("/", supervisorMethods.getSupervisores);

// Se consulta el cotrolador supervisor, el metodo getSupervisorByCedula 
router.get("/cedula/:cedula", supervisorMethods.getSupervisorByCedula);


// Consultamos si el token que realizo la peticion esta autorizado como director
tokensMethods.isAuthorized(router, ["director"]);

// Se consulta el cotrolador supervisor, el metodo getSupervisorIdByCedula 
router.get("/:cedula", supervisorMethods.getSupervisorIdByCedula);

// Se consulta el cotrolador supervisor, el metodo saveSupervisor 
router.post("/save", supervisorMethods.saveSupervisor);

// Se consulta el cotrolador supervisor, el metodo updateSupervisor 
router.patch("/update/:cedula", supervisorMethods.updateSupervisor);

// Se consulta el cotrolador supervisor, el metodo deleteSupervisor 
router.delete("/delete/:cedula", supervisorMethods.deleteSupervisor);

export default router;

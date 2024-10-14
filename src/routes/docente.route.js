import { Router } from "express";
import { methods as docenteMethods } from "./../controllers/docenteController.js";
import { tokensMethods } from "../functions.js";

const router = Router();


// Consultamos si el token que realizo la peticion esta autorizado como cualquiera de los 2 roles
tokensMethods.isAuthorized(router, ["docente", "director"]);

// Se consulta el cotrolador docente, el metodo getDocenteIdByCedula 
router.get("/cedula/:cedula", docenteMethods.getDocenteIdByCedula); //👀


// Consultamos si el token que realizo la peticion esta autorizado como director
tokensMethods.isAuthorized(router, ["director"]);

// Se consulta el cotrolador docente, el metodo getDocentes 
router.get("/", docenteMethods.getDocentes);

// Se consulta el cotrolador docente, el metodo getDocenteIdByCedula 
router.get("/:cedula", docenteMethods.getDocenteIdByCedula);

// Se consulta el cotrolador docente, el metodo saveDocente 
router.post("/save", docenteMethods.saveDocente);

// Se consulta el cotrolador docente, el metodo updateDocente 
router.patch("/update/:cedula", docenteMethods.updateDocente);

// Se consulta el cotrolador docente, el metodo deleteDocente 
router.delete("/delete/:cedula", docenteMethods.deleteDocente); // ✅

export default router;

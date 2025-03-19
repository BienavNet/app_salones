import { Router } from "express";
import { methods as horarioMethods } from "./../controllers/horarioController.js";
import { tokensMethods } from "../functions.js";

const router = Router();

// Consultamos si el token que realizo la peticion esta autorizado como cualquiera de los 3 roles
tokensMethods.isAuthorized(router, ["docente", "director", "supervisor"]);

// Se consulta el cotrolador horario, el metodo getHorarios
router.get("/", horarioMethods.getHorarios);

// Se consulta el cotrolador horario, el metodo getHorariosByDocente
router.get("/:cedula", horarioMethods.getHorariosByDocente); // ✅

// Consultamos si el token que realizo la peticion esta autorizado como director
tokensMethods.isAuthorized(router, ["director"]);

// Se consulta el cotrolador horario, el metodo getHorarioById
router.get("/detail/:id", horarioMethods.getHorarioById);

// Se consulta el cotrolador horario, el metodo updateHorario
router.patch("/update/:id", horarioMethods.updateHorario);

// Se consulta el cotrolador horario, el metodo deleteHorario
router.delete("/delete/:id", horarioMethods.deleteHorario);
router.delete("/deleteall", horarioMethods.deleteHorarioAll);
// Se consulta el cotrolador horario, el metodo saveHorario
router.post("/save", horarioMethods.saveHorario);

export default router;

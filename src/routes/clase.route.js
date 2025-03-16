import { Router } from "express";
import { methods as claseMethods } from "./../controllers/claseController.js";
import { tokensMethods } from "../functions.js";
const router = Router();

// Consultamos si el token que realizo la peticion esta autorizado como cualquiera de los 3 roles
tokensMethods.isAuthorized(router, ["supervisor", "docente", "director"]);
// Se consulta el cotrolador clase, el metodo getClasebyHorario
router.get("/horario/:horario", claseMethods.getClaseByHorario);
// Se consulta el cotrolador clase, el metodo getClaseBySalon
router.get("/salon/:salon", claseMethods.getClaseBySalon);
// Se consulta el cotrolador clase, el metodo filterByDate
router.get("/docente/:cedula/fecha/:fecha", claseMethods.filterByDate); // por una sola fecha
// Se consulta el cotrolador clase, el metodo filterBySupSalDiaHor
router.get(
  "/supervisor/:cedula/salon/:salon/dia/:dia/horario/:horario",
  claseMethods.filterBySupSalDiaHor
); // ✅
// Se consulta el cotrolador clase, el metodo filterByDoc
router.get("/docente/:cedula", claseMethods.filterByDoc);
// Se consulta el cotrolador clase, el metodo getClaseBySupervisor
router.get("/supervisor/:cedula", claseMethods.getClaseBySupervisor);
// Consultamos si el token que realizo la peticion esta autorizado como director
tokensMethods.isAuthorized(router, ["director"]);

// Se consulta el cotrolador clase, el metodo getClases
router.get("/", claseMethods.getClases);

// Se consulta el cotrolador clase, el metodo registerClase
router.post("/register", claseMethods.registerClase);

// Se consulta el cotrolador clase, el metodo getIdClase
router.get("/:id", claseMethods.getIdClase);

// Se consulta el cotrolador clase, el metodo getClassHorarioId
router.get("/timetable/:id", claseMethods.getClassHorarioId);

// Se consulta el cotrolador clase, el metodo deleteClase
router.delete("/delete/:id", claseMethods.deleteClase);

// Se consulta el cotrolador clase, elimina todas las clases
router.delete("/deleteall/", claseMethods.deleteClaseAll);

// Se consulta el cotrolador clase, el metodo updateClase
router.patch("/update/:id", claseMethods.updateClase);

export default router;

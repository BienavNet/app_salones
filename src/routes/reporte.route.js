import { Router } from "express";
import { methods as reporteMethods} from "./../controllers/reporteController.js"
import { tokensMethods } from "../functions.js";

const router = Router();

tokensMethods.isAuthorized(router, ["supervisor", "director"]) 
router.get("/supervisor/:id", reporteMethods.getReporteBySupervisor) // ✅
router.post("/register", reporteMethods.registrarReporte) // ✅
router.get("/supervisor/:cedula/salon/:salon", reporteMethods.filterBySupAndSal) // ✅ por default la cedula del supervisor, filtra por el salon seleccionado
router.patch("/update/:id", reporteMethods.updateReporte) // ✅

// Consultamos si el token que realizo la peticion esta autorizado como cualquiera de los 2 roles
tokensMethods.isAuthorized(router, ["supervisor", "director"]) 

// Se consulta el cotrolador reporte, el metodo getReporteBySupervisor 
router.get("/supervisor/:id", reporteMethods.getReporteBySupervisor)

// Se consulta el cotrolador reporte, el metodo registrarReporte 
router.post("/register/:estado", reporteMethods.registrarReporte)

// Se consulta el cotrolador reporte, el metodo filterBySupAndSal 
router.get("/supervisor/:cedula/salon/:salon", reporteMethods.filterBySupAndSal)

// Se consulta el cotrolador reporte, el metodo updateReporte 
router.patch("/update/:id", reporteMethods.updateReporte)


// Consultamos si el token que realizo la peticion esta autorizado como director
tokensMethods.isAuthorized(router, ["director"])

// Se consulta el cotrolador reporte, el metodo getReportes 
router.get("/", reporteMethods.getReportes)

// Se consulta el cotrolador reporte, el metodo getReporteByClase 
router.get("/clase/:clase", reporteMethods.getReporteByClase)

// consulta todos los reporte x id
router.get("/:id", reporteMethods.getReporteByID)

// Se consulta el cotrolador reporte, el metodo getReporteBySalon 
router.get("/salon/:salon", reporteMethods.getReporteBySalon)

// Se consulta el cotrolador reporte, el metodo deleteReporte 
router.delete("/delete/:id", reporteMethods.deleteReporte) 

// Se consulta el cotrolador reporte, el metodo getSalonMasUtilizado 
router.get("/statistics/salon-mas-utilizado", reporteMethods.getSalonMasUtilizado)

// Se consulta el cotrolador reporte, el metodo getSalonMenosUtilizado 
router.get("/statistics/salon-menos-utilizado", reporteMethods.getSalonMenosUtilizado)

// Se consulta el cotrolador reporte, el metodo getCantidadDiaMasAsignado 
router.get("/statistics/cantidad-dias-asignado", reporteMethods.getCantidadDiaMasAsignado)

// Se consulta el cotrolador reporte, el metodo getRangeHoursMasFrecuente 
router.get("/statistics/hours-mas-frecuente", reporteMethods.getRangeHoursMasFrecuente) // ✅


// Se consulta el cotrolador reporte, el metodo getDocenteQMasComentariosHaRealizado 
router.get("/statistics/docente-mas-comentarios", reporteMethods.getDocenteQMasComentariosHaRealizado)

// Se consulta el cotrolador reporte, el metodo getsalonMasComentarioTiene 
router.get("/statistics/salon-mas-comentarios", reporteMethods.getsalonMasComentarioTiene) 
export default router
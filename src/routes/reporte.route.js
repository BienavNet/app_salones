import { Router } from "express";
import { methods as reporteMethods} from "./../controllers/reporteController.js"
import { tokensMethods } from "../functions.js";

const router = Router();

tokensMethods.isAuthorized(router, ["supervisor", "director"]) 
router.get("/supervisor/:id", reporteMethods.getReporteBySupervisor) //👀
router.post("/register", reporteMethods.registrarReporte)
router.post("/update/:id", reporteMethods.updateReporte)
router.get("/supervisor/:cedula/salon/:salon", reporteMethods.filterBySupAndSal)
router.patch("/update/:id", reporteMethods.updateReporte)

tokensMethods.isAuthorized(router, ["director"])
router.get("/", reporteMethods.getReportes) // ✅
router.get("/clase/:clase", reporteMethods.getReporteByClase) //👀
router.get("/salon/:salon", reporteMethods.getReporteBySalon) //👀
router.delete("/delete/:id", reporteMethods.deleteReporte) 

router.get("/statistics/docente-mas-comentarios", reporteMethods.getDocenteQMasComentariosHaRealizado)  // ✅
router.get("/statistics/salon-mas-comentarios", reporteMethods.getsalonMasComentarioTiene)  // ✅
router.get("/statistics/salon-mas-utilizado", reporteMethods.getSalonMasUtilizado)  // ✅
router.get("/statistics/salon-menos-utilizado", reporteMethods.getSalonMenosUtilizado)  // ✅
router.get("/statistics/cantidad-dias-asignado", reporteMethods.getCantidadDiaMasAsignado) // ✅
router.get("/statistics/hours-mas-frecuente", reporteMethods.getRangeHoursMasFrecuente) // ✅

export default router
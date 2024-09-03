import { Router } from "express";
import { methods as reporteMethods} from "./../controllers/reporteController.js"
import { tokensMethods } from "../functions.js";

const router = Router();

tokensMethods.isAuthorized(router, ["supervisor", "director"])
router.get("/supervisor/:id", reporteMethods.getReporteBySupervisor)
router.post("/register", reporteMethods.registrarReporte)
router.post("/update/:id", reporteMethods.updateReporte)
router.get("/supervisor/:cedula/salon/:salon", reporteMethods.filterBySupAndSal)

tokensMethods.isAuthorized(router, ["director"])
router.get("/", reporteMethods.getReportes)
router.get("/clase/:clase", reporteMethods.getReporteByClase)
router.get("/salon/:salon", reporteMethods.getReporteBySalon)
router.delete("/delete/:id", reporteMethods.deleteReporte)

export default router
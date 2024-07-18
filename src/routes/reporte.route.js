import { Router } from "express";
import { methods as reporteMethods} from "./../controllers/reporteController.js"

const router = Router();

router.get("/", reporteMethods.getReportes)
router.get("/supervisor/:id", reporteMethods.getReporteBySupervisor)
router.get("/clase/:clase", reporteMethods.getReporteByClase)
router.get("/salon/:salon", reporteMethods.getReporteBySalon)
router.post("/register", reporteMethods.registrarReporte)
router.post("/update/:id", reporteMethods.updateReporte)
router.get("/delete/:id", reporteMethods.deleteReporte)

export default router
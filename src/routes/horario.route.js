import { Router } from "express";
import { methods as horarioMethods} from "./../controllers/horarioController.js"
import { tokensMethods } from "../functions.js";

const router = Router()

tokensMethods.isAuthorized(router, ["docente", "director"])
router.get("/:cedula", horarioMethods.getHorariosByDocente)

tokensMethods.isAuthorized(router, ["director"])
router.get("/detail/:id", horarioMethods.getHorarioById) // ✅
router.get("/", horarioMethods.getHorarios) // ✅
router.patch("/update/:id", horarioMethods.updateHorario)  // ✅
router.delete("/delete/:id", horarioMethods.deleteHorario) // ✅
router.post("/save", horarioMethods.saveHorario) // ✅

export default router;

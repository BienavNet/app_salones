import { Router } from "express";
import { methods as comentarioMethods} from "./../controllers/comentarioController.js"

const router = Router();

router.get("/:id", comentarioMethods.getComentarioById)
router.get("/docente/:cedula", comentarioMethods.getComentarioByDocente)
router.get("/salon/:salon", comentarioMethods.getComentarioBySalon)
router.get("/", comentarioMethods.getAllComentarios)
router.post("/register", comentarioMethods.registerComentario)
router.delete("/delete/:id", comentarioMethods.deleteComentarioById)
router.delete("/delete/docente/:cedula", comentarioMethods.deleteComentarioByDocente)

export default router

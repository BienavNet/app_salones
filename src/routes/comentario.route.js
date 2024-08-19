import { Router } from "express";
import { methods as comentarioMethods} from "./../controllers/comentarioController.js"
import { tokensMethods } from "../functions.js";

const router = Router();

tokensMethods.isAuthorized(router, ["docente", "director"])
router.get("/docente/:cedula", comentarioMethods.getComentarioByDocente)
router.post("/register", comentarioMethods.registerComentario)
router.delete("/delete/docente/:cedula", comentarioMethods.deleteComentarioByDocente)

tokensMethods.isAuthorized(router, ["director"])
router.get("/:id", comentarioMethods.getComentarioById)
router.get("/", comentarioMethods.getAllComentarios)
router.get("/salon/:salon", comentarioMethods.getComentarioBySalon)
router.delete("/delete/:id", comentarioMethods.deleteComentarioById)

export default router

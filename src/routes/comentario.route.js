import { Router } from "express";
import { methods as comentarioMethods} from "./../controllers/comentarioController.js"
import { tokensMethods } from "../functions.js";

const router = Router();

// Consultamos si el token que realizo la peticion esta autorizado como cualquiera de los 2 roles
tokensMethods.isAuthorized(router, ["docente", "director"])

// Se consulta el cotrolador comentario, el metodo getComentarioByDocente 
router.get("/docente/:cedula", comentarioMethods.getComentarioByDocente)

// Se consulta el cotrolador comentario, el metodo registerComentario 
router.post("/register", comentarioMethods.registerComentario)

// Se consulta el cotrolador comentario, el metodo deleteAllComentariosByDocente 
router.delete("/delete/docente/:cedula", comentarioMethods.deleteAllComentariosByDocente)

// Se consulta el cotrolador comentario, el metodo deleteComentarioById 
router.delete("/delete/:id", comentarioMethods.deleteComentarioById)

// Se consulta el cotrolador comentario, el metodo filterByDocAndSal 
router.get("/docente/:cedula/salon/:salon", comentarioMethods.filterByDocAndSal) 


// Consultamos si el token que realizo la peticion esta autorizado como director
tokensMethods.isAuthorized(router, ["director"])

// Se consulta el cotrolador comentario, el metodo getComentarioById 
router.get("/:id", comentarioMethods.getComentarioById)

// Se consulta el cotrolador comentario, el metodo getAllComentarios 
router.get("/", comentarioMethods.getAllComentarios)

// Se consulta el cotrolador comentario, el metodo getComentarioBySalon 
router.get("/salon/:salon", comentarioMethods.getComentarioBySalon)// ✅
export default router

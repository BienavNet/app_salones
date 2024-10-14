import { Router } from "express";
import { methods as loginMethods} from "./../controllers/loginController.js";
import { tokensMethods } from "../functions.js";

const router = Router();


// Se consulta el cotrolador login, el metodo checkLogin 
router.post("/", loginMethods.checkLogin);

// Importa un nuevo controlador, y revisa si la sesion es valida o no
router.get("/sesion", tokensMethods.checkSession); // ✅
export default router;

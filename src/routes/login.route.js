import { Router } from "express";
import { methods as loginMethods} from "./../controllers/loginController.js";
import { tokensMethods } from "../functions.js";


const router = Router();

router.post("/", loginMethods.checkLogin); // ✅
router.get("/sesion", tokensMethods.checkSession); // ✅

export default router;

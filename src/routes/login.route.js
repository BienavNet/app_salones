import { Router } from "express";
import { methods as loginMethods} from "./../controllers/loginController.js";


const router = Router();

router.get("/", loginMethods.checkLogin);


export default router;

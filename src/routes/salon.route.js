import { Router } from "express";
import { methods as salonMethods} from "./../controllers/salonController.js"
import { tokensMethods } from "../functions.js";

const router = Router();

tokensMethods.isAuthorized(router, ["administrador"])

router.get("/:id", salonMethods.getSalonById)
router.get("/", salonMethods.getSalones)
router.post("/update/:id", salonMethods.updateSalon)

export default router
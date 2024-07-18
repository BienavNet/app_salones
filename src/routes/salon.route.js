import { Router } from "express";
import { methods as salonMethods} from "./../controllers/salonController.js"

const router = Router();

router.get("/:id", salonMethods.getSalonById)
router.get("/", salonMethods.getSalones)
router.post("/update/:id", salonMethods.updateSalon)

export default router
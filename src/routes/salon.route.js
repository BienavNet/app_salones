import { Router } from "express";
import { methods as salonMethods} from "./../controllers/salonController.js"
import { tokensMethods } from "../functions.js";

const router = Router();

tokensMethods.isAuthorized(router, ["director", "supervisor"])
router.get("/", salonMethods.getSalones) // ✅

tokensMethods.isAuthorized(router, ["director"])
router.get("/:id", salonMethods.getSalonById)  // ✅
router.patch("/update/:id", salonMethods.updateSalon) // ✅
router.get("/categoria-salon/salon", salonMethods.categorySalonID)// ✅
export default router


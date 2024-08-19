import { Router } from "express";
import { methods as docenteMethods } from "./../controllers/docenteController.js";
import { tokensMethods } from "../functions.js";

const router = Router();

try {
  tokensMethods.isAuthorized(router, ["docente", "director"]);
  router.get("/cedula/:cedula", docenteMethods.getDocenteIdByCedula);

  tokensMethods.isAuthorized(router, ["director"]);
  router.get("/", docenteMethods.getDocentes); // ✅
  router.get("/:cedula", docenteMethods.getDocenteIdByCedula); // ✅
  router.post("/save", docenteMethods.saveDocente); // ✅
  router.patch("/update/:cedula", docenteMethods.updateDocente); // ✅
  router.delete("/delete/:cedula", docenteMethods.deleteDocente); // ✅
} catch (error) {
  console.log(error.message);
}

export default router;

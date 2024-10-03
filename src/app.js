import express from "express";
import morgan from "morgan";
import cors from "cors"
import cookieParser from "cookie-parser";
import http from "http";
// Import Routes
import docenteRoute from "./routes/docente.route.js"
import supervisorRoute from "./routes/supervisor.route.js"
import loginRoute from "./routes/login.route.js"
import horarioRoute from "./routes/horario.route.js"
import claseRoute from "./routes/clase.route.js"
import comentarioRoute from "./routes/comentario.route.js"
import detalle_horarioRoute from "./routes/detalle_horario.route.js"
import reporteRoute from "./routes/reporte.route.js"
import salonRoute from "./routes/salon.route.js"
import notificacionRoute from "./routes/notificacion.route.js"

//Crypto port file gen 
import { PORT } from "./config.js";
import { initSocketServer } from "./utils/WebsocketServer.js";
const app = express();
const server = http.createServer(app);
initSocketServer(server);

// Settings app
app.set("port", PORT)

// Middlewares
app.use(cors({
    origin: '*', // mientras le ponemos el dominio del frontend
  }))
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

// Routes
app.use("/api/docente", docenteRoute)
app.use("/api/supervisor", supervisorRoute)
app.use("/api/login", loginRoute)
app.use("/api/horarios/", horarioRoute)
app.use("/api/clase/", claseRoute)
app.use("/api/comentarios/", comentarioRoute)
app.use("/api/horarios/detalles/", detalle_horarioRoute)
app.use("/api/reporte/", reporteRoute)
app.use("/api/salon/", salonRoute)
app.use("/api/notificaciones/", notificacionRoute)

// si la rutas no coinciden 
app.use((req, res, next) => {
    res.status(404).json({ message: "API route not found" });
  });

export { server, app};

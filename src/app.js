import express from "express";
import moment from "moment-timezone";
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

// Crea una nueva app
const app = express();

// Crea un nuevo servidor donde va a estar hosteado el web socket
const server = http.createServer(app);
initSocketServer(server);

// Se inicializa la app con un puerto de escucha de peticiones
app.set("port", PORT)

function checkBusinessHours(req, res, next) {
  const currentHour = moment.tz("America/Bogota").hours();
  if (currentHour >= 23 || currentHour < 6) {
    return res.status(403).json({ message: "El servicio no está disponible fuera del horario laboral (11 PM a 6 AM)" });
  }
  next(); 
}

// Usar el middleware globalmente
app.use(checkBusinessHours);
// Middlewares
app.use(cors())

// Se crean diversos middlewares para el tratamiento de las peticiones
app.use(cors({
    origin: '*', // mientras le ponemos el dominio del frontend
  }))

app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

// Se importan todas las rutas creadas previamente que se conectan con los controladores para generar la funcionalidad del api
app.use("/api/docente", docenteRoute)
app.use("/api/supervisor", supervisorRoute)
app.use("/api/login", loginRoute)
app.use("/api/horarios/detalles/", detalle_horarioRoute)
app.use("/api/horarios/", horarioRoute)
app.use("/api/clase/", claseRoute)
app.use("/api/comentarios/", comentarioRoute)
app.use("/api/reporte/", reporteRoute)
app.use("/api/salon/", salonRoute)
app.use("/api/notificaciones/", notificacionRoute)

app.use("/",(req, res, next) => {
  res.status(200).json({ message: "Bienvenido a la API de mi aplicacion movil de gestion y control UPC Aguachica" });
})
// si la rutas no coinciden 
app.use((req, res, next) => {
    res.status(404).json({ message: "API route not found" });
  });

export { server, app};

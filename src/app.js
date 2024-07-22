import express from "express";
import morgan from "morgan";
import cors from "cors"
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

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
import { PORT } from "./config.js";

const app = express();

// Settings app
app.set("port", PORT)

// Middlewares
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())
app.use(cookieParser())

app.use((req, res, next)=>{
    const token = req.cookies.access_token
    req.session = { persona : null}
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.session.persona = data
    } catch{}

    next() // -> sigue la siguiente ruta o middleware
})

// Routes
app.use("/api/docentes/", docenteRoute)
app.use("/api/supervisores/", supervisorRoute)
app.use("/login", loginRoute)
app.use("/api/horarios/", horarioRoute)
app.use("/api/clase/", claseRoute)
app.use("/api/comentarios/", comentarioRoute)
app.use("/api/horarios/detalles/", detalle_horarioRoute)
app.use("/api/reporte/", reporteRoute)
app.use("/api/salon/", salonRoute)

export default app;



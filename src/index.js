import { server } from "./app.js";
import { PORT } from "./config.js";
import { io } from "./utils/WebsocketServer.js";
import { getUnreadCount } from "./controllers/notificacionController.js";

const main = () => {
  console.log("###### API REST ######");
  console.log("######################");
  server.listen(PORT, () => {
    console.log("######################");
    console.log("###### WEBSOCKET ######");
    console.log(`http://localhost:${PORT}`);

    // cuando el usuario se conecta
    io.sockets.on("connection", (socket) => {
      console.log("NUEVO USUARIO CONECTADO");
      // cuando el usuario es logeado
      socket.on("authenticate", async ({ userId, rol }) => {
        socket.join(userId); // sala personal
        socket.join(rol); // sala grupal

        try {
          const unreadCount = await getUnreadCount(userId);
          console.log(`cantidad de no leidad: ${unreadCount} del usuario: ${userId} con el rol  ${rol}`);
          socket.emit("count-notification", unreadCount); // Emite el conteo de no leídas a la sala del usuario logeado cuando ingresa,
        } catch (error) {
          throw Error("Error fetching notifications:", error.message);
        }
      });


      // cuando el usuario se desconecta
      socket.on("disconnect", () => {
        console.log("USUARIO DESCONECTADO");
      });
    });
  });
};

main();

import { server } from "./app.js";
import { PORT } from "./config.js";
import { io } from "./utils/WebsocketServer.js";
import { getUnreadCount } from "./controllers/notificacionController.js";

const main = () => {
  console.log("###### API REST ######");
  console.log("######################");

  server.listen(PORT, () => {
    io.sockets.on("connection", (socket) => {
      console.log("CONEXION CON WEBSOCKET");

      // cuando el usuario es logeado
      socket.on("authenticate", async ({ userId, rol }) => {
        if (!userId || !rol) {
          console.log("Autenticación fallida: falta userId o rol");
          return;
        }
        if (!io.sockets.adapter.rooms.get(userId)?.has(socket.id)) {
          socket.join(userId.toString()); // sala personal
        }

        if (!io.sockets.adapter.rooms.get(rol)?.has(socket.id)) {
          socket.join(rol); // sala grupal
        }

        try {
          const unreadCount = await getUnreadCount(userId);
          socket.emit("count-notification", unreadCount); // Emitir el conteo de notificaciones no leídas al usuario autenticado
        } catch (error) {
          console.error(
            "Error al obtener las notificaciones no leídas:",
            error
          );
          return;
        }
      });

      // cuando el usuario se desconecta
      socket.on("disauthenticate", (id) => {
        socket.leave(id);
        console.log("USUARIO DESCONECTADO", id);
      });

      socket.on("disconnect", () => {
        console.log("USUARIO DESCONECTADO");
      });
    });
  });
};

main();

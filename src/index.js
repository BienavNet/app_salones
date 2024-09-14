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
          socket.emit("count-notification", unreadCount); // Emite el conteo de no leídas a la sala del usuario logeado cuando ingresa,
        } catch (error) {
          throw Error("Error fetching notifications:", error.message);
        }
      });

      // envia la notification a el usuario espesifico por el user_id
      socket.on("send-notification-to-user", ({ userId, count }) => {
        io.to(userId).emit("notification", count); // Enviar a la sala del userId
        console.log(`Notificación enviada a usuario ${userId}`);
      });

      // Enviar notificación a todos los 'admin' y a un 'supervisor' específico
      socket.on(
        "send-notification-to-admins-and-supervisor",
        ({ supervisorId, message }) => {
          io.to("admin").emit("notification", message); // Enviar a todos los admin
          io.to(supervisorId).emit("notification", message); // Enviar al supervisor específico
          console.log(
            `Notificación enviada a todos los admin y al supervisor ${supervisorId}`
          );
        }
      );

      // cuando el usuario se desconecta
      socket.on("disconnect", () => {
        console.log("USUARIO DESCONECTADO");
      });
    });
  });
};

main();

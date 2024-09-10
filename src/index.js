import { server } from "./app.js";
import { PORT } from "./config.js";
import { io } from "./utils/WebsocketServer.js";
import { getUnreadCount } from "./controllers/notificacionController.js";

const main = () => {
  console.log("######################");
  console.log("###### API REST ######");
  console.log("######################");
  // app.listen(app.get("port")); // comentamos esta linea para poder utilizar websokcet en el mismo puerto de la api rest

  server.listen(PORT, () => {
    console.log("######################");
    console.log("###### WEBSOCKET ######");
    console.log("######################");
    console.log(`http://localhost:${PORT}`);

    io.sockets.on("connection", (socket) => {
      console.log("NUEVO USUARIO CONECTADO");

      socket.on("authenticate", async (userId) => {
        socket.join(userId);
        try {
          const unreadCount = await getUnreadCount(userId);
          socket.emit("count-notification", unreadCount); // Emite el conteo de no leídas al iniciar sesion el cliente.
          console.log(`Sent unread notifications count to user ${userId}`);
        } catch (error) {
          throw Error("Error fetching notifications:", error.message);
        }  
      });

      socket.on("disconnect", () => {
        console.log("USUARIO DESCONECTADO");
      });

      socket.on("notification", (notification) => {
        io.emit("notification", notification);
      });
    });
  });
};

main();

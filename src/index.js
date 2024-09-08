import { server } from "./app.js";
import { PORT } from "./config.js";
import { io } from "./utils/WebsocketServer.js";
import { methods as database } from "./database/database.js";
const main = () => {
  console.log("######################");
  console.log("###### API REST ######");
  console.log("######################");
  // app.listen(app.get("port")); // comentamos esta linea para poder utilizar websokcet en el mismo puerte de la api rest

  server.listen(PORT, () => {
    console.log("######################");
    console.log("###### WEBSOCKET ######");
    console.log("######################");
    console.log(`http://localhost:${PORT}/api`);

    io.sockets.on("connection", (socket) => {
      console.log("NUEVO USUARIO CONECTADO");

      socket.on("authenticate", async (userId) => {
        socket.join(userId);
        try {
          const NOLEIDA = "no leida";
          const connection = await database.getConnection();
          const result = await connection.query(
            `SELECT COUNT(*) AS no_leida 
            FROM notificacion 
            WHERE para = ? AND estado = ?`,
            [userId, NOLEIDA]
          );
          const COUNTA = result[0]?.no_leida;
          // Emitir el conteo actualizado de notificaciones no leídas al cliente autenticado
          socket.emit("notification", COUNTA);

          console.log(`Sent unread notifications count to user ${userId}`);
        } catch (error) {
          console.error("Error fetching notifications:", error.message);
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

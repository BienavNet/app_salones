import { Server as SocketServer } from "socket.io";
export let io = null;


// Abre una nueva conexion de web sockets para enviar la informacion de las notificaciones
export function initSocketServer(server) {
  io = new SocketServer(server, {
    cors: {
      origin: "*",
    },
  });
}

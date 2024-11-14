import { createPool } from "mysql2/promise";
import { DATABASE, HOST, MYSQLPORT, PASSWORD, USER } from "../config.js";
console.log("config js DATABASE, HOST, MYSQLPORT, PASSWORD, USER", DATABASE, HOST, MYSQLPORT, PASSWORD, USER)
export const connection = createPool({
  host: HOST,
  database:DATABASE,
  user:USER,
  password: PASSWORD,
  port:MYSQLPORT,
});

async function checkConnection() {
  try {
    await connection.getConnection();
    console.log("Conexión a la base de datos establecida correctamente.");
  } catch (error) {
    console.error("Error al conectarse a la base de datos:", error.message);
    throw new Error("Error al conectarse a la base de datos");
  }
}

checkConnection();
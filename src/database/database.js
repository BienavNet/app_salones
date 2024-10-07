import { createPool } from "mysql2/promise";
import { DATABASE, HOST, MYSQLPORT, PASSWORD, USER } from "../config.js";

console.log(`informacion de la env base de datos Database: ${DATABASE} host: ${HOST} Puerto: ${MYSQLPORT} pass: ${PASSWORD} user: ${USER}`)
export const connection = createPool({
  host: HOST,
  database:DATABASE,
  user:USER,
  password: PASSWORD,
  port:MYSQLPORT,
});

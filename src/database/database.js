import { createPool } from "mysql2/promise";
import { DATABASE, HOST, MYSQLPORT, PASSWORD, USER } from "../config.js";

console.log("variables de entorno", HOST, DATABASE, USER, PASSWORD, MYSQLPORT)

export const connection = createPool({
  host: HOST,
  database:DATABASE,
  user:USER,
  password: PASSWORD,
  port:MYSQLPORT,
});

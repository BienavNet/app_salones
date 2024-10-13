import { createPool } from "mysql2/promise";
import { DATABASE, HOST, MYSQLPORT, PASSWORD, USER } from "../config.js";

export const connection = createPool({
  host: HOST,
  database:DATABASE,
  user:USER,
  password: PASSWORD,
  port:MYSQLPORT,
});

if (!connection){ throw Error("Errror al conectarse con la base de datos")}
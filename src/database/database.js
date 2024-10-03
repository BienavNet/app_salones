import mysql from "mysql2/promise";
import config from "../config.js";

const connection = await mysql.createConnection({
    host: config.host,
    database: config.database,
    user: config.username,
    password: config.password,
    port: config.port
})

const getConnection = ()=> {
   return connection
}

export const methods = {
    getConnection
} 

import mysql from "mysql2/promise";
import config from "../config.js";

// const connection = await mysql.createConnection({
//     host: config.host,
//     database: config.database,
//     user: config.username,
//     password: config.password,
//     port: config.port
// })

const connection = ()=> {
    return new Promise(async (resolve, reject) => {
        let connection = await mysql.createConnection({
            host: config.host,
            database: config.database,
            user: config.username,
            password: config.password
        })

        connection.connect(err => {
            if(err){
                reject(err)
            }else{
                resolve(true)
            }
        })
    })
}

const getConnection = ()=> {
   return connection
}

export const methods = {
    getConnection
} 

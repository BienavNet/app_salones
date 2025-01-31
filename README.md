## Document
instalar xampp, ejecutar apache y mysql
subir archivo de database, cambiar configuracion de acceso.

add libreria de cors
> npm i cors [link:](https://www.npmjs.com/package/cors)

Utilizamos la funciones de crypto 

instalamo la libreria de bcryptjs
> npm i bcryptjs [link:] (https://www.npmjs.com/package/bcryptjs)

//añadimos json web token JWT
> npm install jsonwebtoken [link:] ()

//añadimos las cookies
 > npm install cookie-parser // otro tipo de middleware

arreglando conflict cambios

instalamos uso de websocket en express para notificationes
> npm install socket.io

Se utilizaba mysql promise-mysql pero dado que a la hora del deploy la libreria de promise-mysql no soporta el plugin de autenticación **caching_sha2_password** que es el predeterminado en MySQL 8.0
> npm uninstall promise-mysql

ahora se considera usar mysql2 que soporta el plugin de autenticación **caching_sha2_password**
# Installation
> npm install --save mysql2 https://sidorares.github.io/node-mysql2/docs

## En comparacion de peso
promise-mysql actualmente tiene un peso de **355.7K (gzipped :112.5k)** 
mysql2/promise actualmente tiene un peso de **781.4K (gzipped :345.5k)**

ahora si les procupa el peso que contiene cada libreria otra opcion seria
donde haran el deploy de la base de datos mirar si no exigen el soporte de **caching_sha2_password** o en defecto utilizar la bases de datos que ya viene configuradas por defecto con el sistema donde hagan el deployment

dado que mysql2/promise devuelve en una promesa un array de objetos utilizar
> const [result] = conecction.query('sql')
> res.json(result[0])

Instalamos moment-timezone (valida y manipula fechas y horas en javascript)
> npm i moment-timezone

send your first email using the Resend Node.js SDK.
> npm install resend

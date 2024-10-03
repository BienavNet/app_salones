import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config();
}

export default {
  host: process.env.NODE_ENV === "production" ? process.env.MYSQLHOST : process.env.HOST,
  database: process.env.NODE_ENV === "production" ? process.env.MYSQLDATABASE : process.env.DATABASE,
  username: process.env.NODE_ENV === "production" ? process.env.MYSQLUSER : process.env.USER,
  password: process.env.NODE_ENV === "production" ? process.env.MYSQLPASSWORD : process.env.PASSWORD,
  port: process.env.NODE_ENV === "production" ? process.env.MYSQLPORT : 3306,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
};

export const { PORT = 5000, SALTROUNDS = 10 } = process.env;
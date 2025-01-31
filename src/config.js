import { config } from "dotenv";

config();
export const HOST = process.env.MYSQLHOST || process.env.HOST;
export const DATABASE = process.env.MYSQLDATABASE || process.env.DATABASE;
export const USER = process.env.MYSQLUSER || process.env.USER;
export const PASSWORD = process.env.MYSQLPASSWORD || process.env.PASSWORD;
export const MYSQLPORT = process.env.MYSQLPORT || 3306;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const PORT = process.env.PORT || 5000;
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const EMAIL_DOMINIO = process.env.EMAIL_DOMINIO;
export const { SALTROUNDS = 10 } = process.env;
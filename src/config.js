import { config } from "dotenv";

if(process.env.NODE_ENV !== "production"){
    config();
}

export default {
    host: process.env.HOST,
    database: process.env.DATABASE,
    username: process.env.USER,
    password: process.env.PASSWORD,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY
}

export const {
    PORT = 5000,
    SALTROUNDS = 10
} = process.env
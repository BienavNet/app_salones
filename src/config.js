import { config } from "dotenv";

config();

export default {
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    username: process.env.USER || "",
    password: process.env.PASSWORD || ""
}

export const {
    PORT = 5000
} = process.env
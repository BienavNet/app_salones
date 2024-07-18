import { config } from "dotenv";

config();

export default {
    host: process.env.HOST || "",
    database: process.env.DATABASE || "",
    username: process.env.USER || "",
    password: process.env.PASSWORD || ""
}
import "colors";
import dotenv from "dotenv";
import ParaxClient from "./structs/ParaxClient";

dotenv.config();
new ParaxClient({
    username: process.env["BOT_USERNAME"],
    password: process.env["OAUTH_TOKEN"]
}).start();

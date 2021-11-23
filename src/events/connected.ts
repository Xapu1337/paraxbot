import {Event} from "../../types/Event";
import PhentixClient from "../structs/ParaxClient";
import {table} from "table";

export default new Event("connected", (client: PhentixClient) => {
    console.log(table([
        ["Information", `Connected to channel: ${process.env["BOT_USERNAME"]}`]
    ], { header: { alignment: "center", content: "CONNECTED!".cyan.bgBlack}}));
});

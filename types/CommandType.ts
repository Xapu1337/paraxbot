import ParaxClient from "../src/structs/ParaxClient";
import {Message} from "./global";

interface RunOptions {
    client: ParaxClient;
    message: Message;
    args: string[];
}

type RunFunction = (options: RunOptions) => Promise<any>;

export type CommandType = {
    name: string;
    category?: string;
    aliases?: string[];
    ownerOnly?: boolean;
    description?: string;
    run: RunFunction;
};

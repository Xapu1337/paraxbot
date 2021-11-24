import ParaxClient from "../src/structs/ParaxClient";
import Collection from "@discordjs/collection";
import {PrivmsgMessage} from "dank-twitch-irc";

interface RunOptions {
    client: ParaxClient;
    message: PrivmsgMessage;
    args: string[];
    flags?: Collection<string, string>;
}

type RunFunction = (options: RunOptions) => Promise<any>;

export enum Permissions {
    OWNER = 1,
    MODERATOR = 2
}

export type CommandType = {
    name: string;
    category?: string;
    aliases?: string[];
    permissions?: number | 0;
    description?: string;
    run: RunFunction;
};

import ParaxClient from "../src/structs/ParaxClient";

interface RunOptions {
    client: ParaxClient;
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

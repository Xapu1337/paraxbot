import klaw from "klaw"
import path, {join} from "path";
import {CommandType} from "../../types/CommandType";
import Collection from "@discordjs/collection";
import {Event} from "../../types/Event";
import {ChatClient, ClientEvents} from "dank-twitch-irc";
import {ClientConfiguration} from "dank-twitch-irc/lib/config/config";
import {Client} from "discord.js";


export default class ParaxClient extends ChatClient {
    public commands: Collection<string, CommandType> = new Collection();
    public events: Collection<string, Event<any>> = new Collection();
    public aliases: Collection<string, string> = new Collection();
    public client: Client;

    constructor(options: ClientConfiguration) {
        super(options);
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default;
    }

    async start() {
        await this.connect().then(() => {
            console.log(`Logged in to ${"Twitch".magenta} as ${process.env["BOT_USERNAME"].cyan.bgBlack}.`);
        });
        await this.registerModules();
        await this.joinAll([process.env["CHANNEL_NAME"]]).then(() => {
            console.log(`Joined channel ${`#${process.env["CHANNEL_NAME"]}`.cyan.bgBlack}.`);
        });
        this.client = new Client({ intents: 32767 });
        await this.client.login(process.env["DISCORD_BOT_TOKEN"]).then(() => {
            console.log(`Logged in to ${"Discord".blue} as ${this.client.user.tag.cyan.bgBlack}.`);
        });

    }


    async registerModules() {
        // Load all commands
        klaw(join(__dirname, "../commands")).on("data", async (item) => {
            // Check if the file is a directory
            const cmdFile = path.parse(item.path);
            // Check if the file is a .ts file
            const category = item.path.match(/\w+(?=[\\/][\w\-.]+$)/)![0];
            if (!cmdFile.ext || cmdFile.ext !== ".ts") return;

            // Import the file
            const cmd: CommandType = await this.importFile(item.path);

            // if the command is not defined abort
            if (!cmd) return;

            // Assign the category to the command
            cmd.category = category;

            // If the command has aliases add them to the collection
            if (cmd.aliases) {
                cmd.aliases.forEach((alias) => {
                    this.aliases.set(alias, cmd.name);
                });
            }

            // Add the command to the collection
            this.commands.set(cmd.name, cmd);

        });

        // Load all events
        klaw(join(__dirname, "../events")).on("data", async (item) => {
            // Check if the file is a directory0
            const eventFile = path.parse(item.path);
            // Check if the file is a .ts file
            if (!eventFile.ext || eventFile.ext !== ".ts") return;

            // Import the file
            const event: Event<keyof ClientEvents> = await this.importFile(item.path);
            // if the event is not defined abort
            if (!event) return;
            // Bind the event to the client
            this.on(event.event, (...args: any[]) => {
                // @ts-ignore
                event.run(this, ...args);
            });
        });
    }

}

import {ChatClient} from "dank-twitch-irc";

export default class ParaxClient extends ChatClient {


    constructor(options: any) {
        super(options);
    }

    async start() {
        await this.connect();
        await this.join(process.env["BOT_USERNAME"])
    }
}

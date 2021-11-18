import {ClientEvents} from "dank-twitch-irc";


export class Event<Key extends keyof ClientEvents> {

    constructor(
        public event: Key,
        public run: (client, ...args: ClientEvents[Key]) => any
    ) {
    }
}

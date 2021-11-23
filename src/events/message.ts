import {Event} from "../../types/Event";
import {PrivmsgMessage} from "dank-twitch-irc";

export default new Event("PRIVMSG", (client, message: PrivmsgMessage) => {
   if(message.messageText.toLowerCase().includes("sus")) client.say(message.channelName, "I would love to ban you but sadly you're the owner.")
});

import {Event} from "../../types/Event";
import {PrivmsgMessage} from "dank-twitch-irc";
import ParaxClient from "../structs/ParaxClient";
import {CommandType, Permissions} from "../../types/CommandType";
import Collection from "@discordjs/collection";

const flagRegex = /(-\w{1}|--\w+)(=("[^"]*"|[^\s"]+))?/g;
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
export default new Event("PRIVMSG", async (client: ParaxClient, message: PrivmsgMessage) => {
   const prefixRegex = new RegExp(
       `^(@${process.env["BOT_USERNAME"]}|${escapeRegex("!")})\\s*`
   );
   if (!prefixRegex.test(message.messageText.toString())) return;
   const match: RegExpMatchArray | null = message.messageText.toString().match(prefixRegex);

   if (!match) return;

   const [, matchedPrefix] = match;

   const args = message.messageText.toString().slice(matchedPrefix.length).trim().split(/ +/g);
   const cmd: string | undefined = args.shift()?.toLowerCase();
   if (!cmd || cmd.length === 0) return;

   if (cmd?.length === 0) return;

   let command: CommandType | undefined;
   // eslint-disable-next-line max-len
   if (client.commands.has(cmd)) command = client.commands.get(cmd);
   else command = client.commands.get(client.aliases.get(cmd));
   const runCommand = async () => await command.run(
       {
          client,
          message,
          args: args.map(arg => arg.replace(flagRegex, "")),
          flags: (message.messageText.toString().match(flagRegex) ?? []).reduce((flags, flag) => {
             const [name, arg] = flag.split("=");

             return flags.set(name.replace(/--?/, ""), arg?.replace(/"*?"/g, ""));
          }, new Collection<string, string>())
       }
   );
   if (command) {
      try {
         if (command.permissions && (command.permissions & Permissions.OWNER)) {
            if(message.senderUsername.toLowerCase() === "parax1337") {
               console.log("owner")
               return runCommand();
            }
            else return;
         } else if(command.permissions && (message.senderUsername.toLowerCase() === "parax1337" || (command.permissions & Permissions.MODERATOR))) {
            if(message.isMod || message.senderUsername.toLowerCase() === "parax1337") {
               return runCommand();
            }
            else return;
         }
         await runCommand();
      } catch (e) {
         await client.say(message.channelName, `😔 Sorry something went wrong.`);
         console.error(e);
      }
   }
});

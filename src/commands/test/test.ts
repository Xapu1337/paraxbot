import {Command} from "../../structs/Command";

export default new Command({
    name: "test",
    description: "Test command",
    aliases: ["test2"],
    permissions: 0,
    async run({ client, message, args }) {
        await client.say(message.channelName, "Test command ran!");
    }
});

const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");
const {stripIndents} = require("common-tags");


class HelpCommand extends Base {
    constructor(client) {
        super(client, {
            name: "help",
            aliases: ["h", "commands", "cmd"],
            category: "Information",
            description: "Returns all commands or detailed information about one!",
            usage: "[command | alias]",
            permissionLevel: 0,
            cooldown: 0,
            currencyCost: 0,

        });
        this.client = client;
    }

    run(message, args) {
        return new Promise(async (resolve) => {
            // If there's an args found
            // Send the info of that command found
            // If no info found, return not found embed.
            if (args[0]) {
                 getCMD(this.client, message, args[0]);
            } else {
                // Otherwise send all the commands available
                // Without the cmd info
                 getAll(this.client, message);
            }
            await resolve(true);
        })


    }


}

function getAll(client, message) {
    const embed = new MessageEmbed().setTimestamp(new Date())
        .setColor("RANDOM");

    // Map all the commands
    // with the specific category
    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.help.category === category)
            .map(cmd => `- \`${cmd.help.name}\``)
            .join("\n");
    };
    // Map all the categories
    const info = client.categories
        .map(cat => stripIndents`**${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed().setTimestamp(new Date());

    // Get the cmd by the name or alias
    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `No information found for **${input.toLowerCase()}**!`;

    // If no cmd is found, send not found embed
    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }
    // Add all cmd info to the embed
    info = `**Name**: ${cmd.help.name}`;
    cmd.conf.aliases ? info += `\n**Aliases**: ${cmd.conf.aliases.map(a => `\`${a}\``).join(", ")}` : info += 'Sorry, no aliases for this command!';
    info += `\n**Description**: ${cmd.help.description}`;
    info += `\n**Permission level**: ${cmd.conf.permissionLevel}`;
    info += `\n**Usage**: !${cmd.help.name} ${cmd.help.usage}`;
    info += `\n **Price**: ${cmd.conf.currencyCost}`;
    embed.setFooter(`Syntax: <> = required, [] = optional`);


    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}

module.exports = HelpCommand;

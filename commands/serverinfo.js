const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");


class ServerInfoCommand extends Base {
    constructor(client) {
        super(client, {
            name: "serverinfo",
            aliases: ["server"],
            category: "Information",
            description: "Returns some information about the server",
            usage: "",
            options:[],
            permissionLevel: 0,
            cooldown: 0,
            currencyCost: 0,

        })
    }

    run() {
        return new Promise((resolve) => {
            resolve(new MessageEmbed().setTimestamp(new Date()).setColor('RANDOM').setTitle('Server info')
                .setDescription(`Name: ${this.guild.name}\n
                            Members: ${this.guild.memberCount}\n
                            Created at: ${this.guild.createdAt}\n
                            Owner: ${this.guild.owner}\n`))
        })
    }

}

module.exports = ServerInfoCommand;

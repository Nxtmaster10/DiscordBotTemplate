const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");


class HackCommand extends Base {
    constructor(client) {
        super(client, {
            name: "Hack",
            aliases: ["hack"],
            category: "Administrator",
            description: "Tries to hack the given user",
            usage: "",
            options: [
                {
                    name: 'user',
                    description: 'The user I will try to hack',
                    required: true,
                    type: 6
                }],
            permissionLevel: 4,
            cooldown: 0
        })
        this.client = client
    }

    run() {
        return new Promise((resolve) => {
            this.channel.send(new MessageEmbed().setDescription(`Hacking <@${this.args.user}>...`).setTitle('Hacking').setColor('GREY').setTimestamp(new Date())).then(msg => {
                this.channel.startTyping(1)
                resolve(null)
                let success = Math.random() > 0.5
                let embed = new MessageEmbed().setTimestamp(new Date()).setTitle('Hacking')
                success ? embed.setColor('GREEN').setDescription(`<@${this.args.user}> was hacked successfully!`) : embed.setColor('RED').setDescription(`<@${this.args.user}> could not be hacked!`)
                setTimeout(() => {
                    this.channel.stopTyping();
                    msg.edit(embed)
                }, 5000)
            })

        })
    }

}

module.exports = HackCommand;

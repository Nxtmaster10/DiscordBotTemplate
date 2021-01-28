const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");


class CreateChannelCommand extends Base {
    constructor(client) {
        super(client, {
            name: "createChannel",
            aliases: ["channel"],
            category: "fun",
            description: "Creates an interactive setup for your own channel",
            usage: "",
            options: [
                {
                    name: 'name',
                    description: 'The name of the channel',
                    required: true,
                    type: 3
                }],
            permissionLevel: 0,
            cooldown: 0,
            currencyCost: 1500
        })
    }

    run() {
        return new Promise(async (resolve) => {


            let category = await this.guild.channels.cache.find(channel => channel.name.toLowerCase() === 'custom channels');
            let channel = await this.guild.channels.create(this.args.name, {parent: category});
            await channel.updateOverwrite(this.guild.roles.cache.find(r => r.name === "@everyone"), {
                'CREATE_INSTANT_INVITE': false,
                'SEND_MESSAGES': false, 'SPEAK': false, 'VIEW_CHANNEL': false
            });
            await channel.updateOverwrite(this.member, {
                'VIEW_CHANNEL': true,
                'SEND_MESSAGES': true,
                'MANAGE_MESSAGES': true,
                'MANAGE_CHANNELS': true,
                'MANAGE_ROLES': true

            });
            await resolve(new MessageEmbed().setTitle('Success').setColor('GREEN')
                .setAuthor(this.member.user.tag, this.member.user.avatarURL).setDescription(`Your channel has been created!
                <#${channel.id}>`))

        })
    }

}

module.exports = CreateChannelCommand;
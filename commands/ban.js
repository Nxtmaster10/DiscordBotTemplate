const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");


class BanCommand extends Base {
    constructor(client) {
        super(client, {
            name: "ban",
            aliases: [],
            options: [
                {
                    name: 'user',
                    description: 'The user who gets banned',
                    required: true,
                    type: 6
                },
                {
                    name: 'reason',
                    description: 'The reason for the ban',
                    type: 4
                }],
            category: "Moderation",
            description: "Bans a user from the server",
            usage: "<@User | Id>",
            permissionLevel: 3,
            cooldown: 0
        })
    }

    run() {
        return new Promise(async (resolve, reject) => {

            this.target = await this.guild.members.cache.get(this.args.user)

            let id;
            if (!this.target) {
                try {
                    await message.guild.members.ban(this.args.user);
                    id = this.args.user;
                } catch (e) {
                    reject(e)
                }
            } else {
                id = this.target.id;
                if (this.args.reason)
                    await this.target.ban({reason: this.args.reason})
                else
                    await this.target.ban();
            }
            await resolve(new MessageEmbed().setTimestamp(new Date()).setTitle('Success!')
                .setDescription(`The user <@${id}> was banned successfully`).setColor('GREEN'))
        })

    }

}

module.exports = BanCommand;

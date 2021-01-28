const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");


class UnbanCommand extends Base {
    constructor(client) {
        super(client, {
            name: "unban",
            aliases: [],
            category: "Moderation",
            description: "Unbans a user",
            usage: "<Id>",
            options: [
                {
                    name: 'user',
                    description: 'The user-id of the user to unban',
                    required: true,
                    type: 4
                },
               ],
            permissionLevel: 3,
            cooldown: 0
        })
    }

    run() {
        return new Promise(async (resolve, reject) => {
            try {
                await message.guild.members.unban(this.args.user);
            } catch (e) {
                reject(e)
            }
            await resolve(new MessageEmbed().setColor("GREEN").setTitle('Success').setTimestamp(new Date())
                .setAuthor(this.member.user.tag, this.member.user.avatarURL()).setDescription('The user was successfully unbanned!'))
        })

    }

}

module.exports = UnbanCommand;

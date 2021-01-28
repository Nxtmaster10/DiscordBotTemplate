const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");
const TEMPLATE = require('../helpers/MessageHelper');


class ClearCommand extends Base {
    constructor(client) {
        super(client, {
            name: "clear",
            aliases: ["purge", "delete"],
            category: "Moderation",
            options: [
                {
                    "name": "all",
                    "description": "Clear the channel",
                    "type": 1, // 2 is type SUB_COMMAND_GROUP
                    "options": []
                },
                {
                    "name": "amount",
                    "description": "Clear any amount of messages up to 100",
                    "type": 1,
                    "options": [
                        {
                            "name": "amount",
                            "description": "Amount of messages to be cleared",
                            "type": 4,
                            required: true
                        },
                        {
                            "name": "user",
                            "description": "User of which the messages should be deleted",
                            "type": 6,

                        }
                    ]

                }],
            description: "Deletes the given amount of messages or deletes all.",
            usage: "<Amount of messages | all> [@User]",
            permissionLevel: 3,
            cooldown: 0,
            currencyCost: 0,
        })
    }

    run(user) {
        return new Promise(async (resolve, reject) => {
            const MESSAGES = new TEMPLATE(this.channel, this.member, this.help);


            if (this.subCommand.toLowerCase() === "all") {
                if (!user || user.permissionLevel < 4) {
                    MESSAGES.noPermission()
                    return reject('Missing permission to clear channel');
                }

                await this.channel.clone({reason: "Clear channel"});
                await this.channel.delete();


            } else if (this.subCommand.toLowerCase() === 'amount') {
                this.amount = this.args.amount


                if (this.args.user)
                    this.target = await this.guild.members.cache.get(this.args.user)

                if (this.amount > 100)
                    this.amount = 100;
                if (this.target) {
                    let messages = await this.channel.messages.fetch({limit: 100})
                    let msgByUser = messages.filter(m => m.author.id === this.target.id);
                    let limited = msgByUser.first(this.amount);
                    await this.channel.bulkDelete(limited);
                } else {
                    let messages = await this.channel.messages.fetch({limit: this.amount})

                    this.channel.bulkDelete(messages, true).then(res => {
                        resolve(new MessageEmbed().setTimestamp(new Date()).setTitle("Success!")
                            .setAuthor(this.member.user.tag, this.member.user.avatarURL())
                            .setColor('#00ff00').setDescription(res.size + ' messages got successfully deleted!'));
                    })
                }
            } else {
                MESSAGES.missingArguments();
                reject('Missing arguments')
            }

        })
    }

}

module.exports = ClearCommand;

const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");


class SayCommand extends Base {
    constructor(client) {
        super(client, {
            name: "say",
            aliases: ["s"],
            category: "Moderation",
            description: "Say someting",
            usage: "<Title> <Color> <Message>",
            options: [
                {
                    name: 'title',
                    description: 'The title of the embed',
                    required: true,
                    type: 3
                },
                {
                    name: 'message',
                    description: 'Your message',
                    required: true,
                    type: 3
                },
                {
                    name: 'color',
                    description: 'The Color of the embed Hex code (including #) or color name',
                    required: true,
                    type: 3
                }],
            permissionLevel: 4,
            cooldown: 0
        })
    }

    run() {
        return new Promise(resolve => {

                resolve (new MessageEmbed().setColor(this.args.message).setTimestamp(new Date()).setTitle(this.args.title).setDescription(this.args.message));

            }
        )
    }

}

module.exports = SayCommand;

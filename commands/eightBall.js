const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");


class EightBallCommand extends Base {
    constructor(client) {
        super(client, {
            name: "8ball",
            aliases: ["8"],
            category: "fun",
            options: [
                {
                    name: 'question',
                    description: 'The question you want to ask',
                    required: true,
                    type: 3
                }],
            description: "Returns a magic answer to your question",
            usage: "<question>",
            permissionLevel: 0,
            cooldown: 0,
            currencyCost: 3,
            keepMessage: true

        })
        this.answers = ["Don't count on it",
            "My reply is no",
            "My sources say no",
            "Outlook not so good",
            "Very doubtful",
            "Reply hazy, try again",
            "Ask again later",
            "Better not tell you now",
            "Cannot predict now",
            "Concentrate and ask again",
            "As I see it, yes",
            "It is certain",
            "It is decidedly so",
            "Most likely",
            "Outlook good",
            "Signs point to yes",
            "Without a doubt",
            "Yes",
            "Yes - definitely",
            "You may rely on it",
        ];
    }

    async run() {
        return new Promise((resolve) => {
            this.channel.send('Hmmmm....').then(msg => {
                msg.delete({timeout: 2000});
                this.channel.startTyping(1);
                setTimeout(() => {
                    this.channel.stopTyping();
                    resolve(new MessageEmbed().setTimestamp(new Date()).setColor('RANDOM').setTitle(`:8ball: ${this.args.question} :8ball:`)
                        .setDescription(`${this.answers[(Math.round(Math.random() * this.answers.length))]}`))

                }, 2000)
            });


        });


    }

}

module.exports = EightBallCommand;
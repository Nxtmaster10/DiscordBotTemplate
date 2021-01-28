const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");

const fetch = require('node-fetch');


class HugCommand extends Base {
    constructor(client) {
        super(client, {
            name: "hug",
            aliases: ["cuddle"],
            category: "fun",
            description: "Hug a user",
            usage: "<@User>",
            options: [
                {
                    name: 'user',
                    description: 'The user who gets a hug',
                    required: true,
                    type: 6
                },
            ],
            permissionLevel: 0,
            cooldown: 0,
            currencyCost: 10
        })
    }

    run() {
        return new Promise(async (resolve) => {


            let target = await this.guild.members.cache.get(this.args.user)
            if (!target)
                return;

            const {link} = await fetch('https://some-random-api.ml/animu/hug').then(response => response.json());

            await resolve(new MessageEmbed().setImage(link).setDescription(`${target}, you have been hugged by ${this.member}`));

        })

    }
}

module.exports = HugCommand;
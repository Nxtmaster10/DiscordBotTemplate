const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");
const CoinHelper = require('../helpers/CoinHelper');


class AddCoinsCommand extends Base {
    constructor(client) {
        super(client, {
            name: "addCoins",
            aliases: ["add"],
            category: "Moderation",
            options: [
                {
                    name: 'user',
                    description: 'The user who gets coins added',
                    required: true,
                    type: 6
                },
                {
                    name: 'amount',
                    description: 'The amount of coins that get added',
                    required: true,
                    type: 4
                }],
            description: "Adds coins to the balance of a given user",
            usage: "<@User> <amount>",
            permissionLevel: 4,
            cooldown: 0,
            currencyCost: 0,
        })
    }

    run() {
        return new Promise(async (resolve) => {


            let amount = parseInt(this.args.amount);
            if (this.args.all) {
                this.guild.members.cache.forEach(member => {
                    let perms = this.channel.permissionsFor(member);
                    if (member.presence.status !== 'offline' && perms.has('VIEW_CHANNEL') && !member.user.bot) {
                        let coinHelper = new CoinHelper(null, member);
                        coinHelper.addCoins(amount);
                    }

                })
                await resolve(new MessageEmbed().setDescription(`Gave everyone online ${amount}📜`))
                return resolve(true);
            }
            let target = await this.guild.members.cache.get(this.args.user)
            const coinHelper = new CoinHelper( this, target);

            let currentCoins = await coinHelper.addCoins(amount);
            await resolve(new MessageEmbed().setTimestamp(new Date()).setColor('GREEN').setTitle('Success')
                .setDescription(`Successfully added ${amount} :scroll: to the balance of ${target}. Balance now: ${currentCoins}`))

        });

    }

}

module.exports = AddCoinsCommand;

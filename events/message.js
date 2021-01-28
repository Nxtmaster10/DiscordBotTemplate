const {MessageEmbed} = require("discord.js");
const XpHelper = require('../helpers/XpHelper');
const CoinHelper = require('../helpers/CoinHelper');

class MessageEvent {
    constructor(client) {
        this.client = client;
        this.xpCooldown = new Set();
    }

    async run(message) {
        if (message.author.bot) return;

        /**
         * Function that adds 3 - 50 coins with a 1% chance to the user's balance
         * @returns {Promise<void>}
         */
        async function specialMessage() {
            const tmpCoinHelper = new CoinHelper(null, message.member);
            let amount = Math.round(Math.random() * 50) + 3;
            if (Math.random() > 0.99) {
                let current = await tmpCoinHelper.addCoins(amount);
                await message.channel.send(new MessageEmbed().setTimestamp(new Date()).setColor('LUMINOUS_VIVID_PINK')
                    .setTitle(':tada: Lucky Message! :tada:').setDescription(`Congratulations ${message.member}, you found ${amount} :scroll:
                You now have ${current} :scroll:!`)).then(msg => {
                    msg.delete({timeout: 20000})
                })
            }
        }

        /**
         * Every minute the user that sent the message gets 1 - 6 xp added
         * @returns {Promise<void>}
         */
        async function addXp() {
            const xpHelper = new XpHelper(message.member, message.channel);
            if (!this.xpCooldown.has(message.author.id)) {
                await xpHelper.addRandomXp();
                this.xpCooldown.add(message.author.id);
                setTimeout(() => {
                    this.xpCooldown.delete(message.author.id);
                }, 60000)
            }
        }

        await addXp.call(this);

        await specialMessage();

    }
}


module.exports = MessageEvent;

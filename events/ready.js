const GiveawayHelper = require('../helpers/GiveawayHelper');
const Giveaways = require('../models/giveaway');

class ReadyEvent {
    constructor(client) {
        this.client = client
    }

    /**
     * Gets all saved giveaways and starts them by calling the drawWinners after the remaining time of the giveaway
     * @returns {Promise<void>}
     */
    async setupGiveaways() {
        let giveaways = await Giveaways.getAll();
        if (giveaways[0]) {
            let channel = this.client.channels.cache.get(giveaways[0].channel);
            let message = channel.lastMessage;
            const giveawayHelper = new GiveawayHelper(this.client, message);
            giveaways.forEach(giveaway => {
                if (giveaway.endsAt) {
                    let remaining = giveaway.endsAt - new Date().getTime()
                    if (remaining > 0) {
                        setTimeout(function () {
                            giveawayHelper.drawWinners(giveaway.messageId)
                        }, (remaining))
                    }
                }
            });
        }
    }

    async run() {
        await this.setupGiveaways.call(this);
        console.log(`Hi, ${this.client.user.username} is now online!`);
        await this.client.user.setPresence({
            status: 'online',
            activity: {
                name: 'You',
                type: `WATCHING`
            }
        });
    }
}

module.exports = ReadyEvent;

const DB = require('../models/user');
const {MessageEmbed} = require('discord.js');
const CoinHelper = require('../helpers/CoinHelper');

class XpHelper {
    constructor(user, channel) {
        this.user = user;
        this.channel = channel;
    }

    getLevel(xp) {
        return new Promise(async (resolve) => {
            if (!xp) {
                let data = await DB.getUser(this.user.id);
                xp = data.xp
            }
            let x = Math.sqrt(xp / 5 + 5) - 1;
            resolve(Math.round(x));
        })

    }

    /**
     * Adds a random amount of xp and returns if the user leveled up
     * @returns {Promise<boolean>}
     */
    addRandomXp() {
        return new Promise(async resolve => {
            let currentLevel = await this.getLevel();
            let amount = Math.round(Math.random() * 6) + 1;
            let currentXp = await this.addXp(amount);
            let level = await this.getLevel(currentXp);
            if (level > currentLevel) {
                await this.channel.send(new MessageEmbed().setTitle('Level Up!').setThumbnail(this.user.user.avatarURL())
                    .setDescription(`:tada: ${this.user} just advanced to level ${level} :tada:`));

                const coinHelper = new CoinHelper(null, this.user);
                level % 5 ? await coinHelper.addCoins(25) : await coinHelper.addCoins(10);
                resolve(true)
            }
            resolve(false)
        })

    }

    /**
     * Adds the given amount of xp
     * @param {Number} amount
     * @returns {Promise<unknown>}
     */
    addXp(amount) {
        return new Promise(async resolve => {
            await DB.getUser(this.user.id);
            DB.findOne({userId: this.user.id}, (err, data) => {
                if(data) {
                    data.xp += amount;
                    let currentXp = data.xp;
                    data.save();
                    resolve(currentXp);
                }else{
                    resolve(0);
                }
            })
        });


    }
}

module.exports = XpHelper;

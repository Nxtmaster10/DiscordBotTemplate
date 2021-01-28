const DB = require('../models/user');
const {MessageEmbed} = require("discord.js");

class CoinHelper {
    constructor(command, user) {
        this.user = user || command.member;
        this.command = command
    }

    /**
     * Removing the given amount of coins or the passed command's cost.
     * If force is set to true the user's balance can go negative
     * @param {Number} amount
     * @param {boolean} force
     * @returns {Promise<unknown>}
     */
    removeCoins(amount, force) {
        if (!amount)
            amount = this.command.conf.currencyCost;
        return new Promise(async (resolve, reject) => {
            let data = await DB.findOne({userId: this.user.id})
            if (amount >= data.coins) {
                if (force)
                    data.coins -= amount;
                else {
                    return reject(new MessageEmbed().setTimestamp(new Date()).setTitle('Error')
                        .setColor('RED').setDescription(`This command costs ${this.command.conf.currencyCost} :scroll:, but you only have ${data.coins} :scroll:.`))
                }            } else
                data.coins -= amount;
            data.save().catch(err => {
                console.log(err);
                return reject(err)
            });
            resolve(data.coins);
        })
    }

    /**
     * Adding the given amount to the user's balance
     * @param {Number} amount
     * @returns {Promise<unknown>}
     */
    addCoins(amount) {
        if (!amount)
            amount = this.command.conf.currencyCost;
        return new Promise(async (resolve, reject) => {
            await DB.getUser(this.user.id)
            let data = await DB.findOne({userId: this.user.id})
            data.coins += amount;
            data.save().catch(err => {
                console.log(err);
                return reject(err)
            });
            resolve(data.coins);
        })
    }
}

module.exports = CoinHelper

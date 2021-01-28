const {MessageEmbed} = require('discord.js');
const DB = require('../models/giveaway');

class GiveawayHelper {
    constructor(client, member, channel, guild) {
        this.guild = guild;
        this.member = member;
        this.channel = channel;
        this.client = client;
    }

    startGiveaway(channel, time, winners, prize) {
        channel.send(new MessageEmbed()
            .setTitle(':tada: New Giveaway! :tada:')
            .setColor('#00ffff')
            .setTimestamp(new Date())
            .setDescription(`Host: ${this.member} \n **Prize: ${prize}**\n Winners: ${winners}`)).then(msg => {
            msg.react('🎉');
            const newGiveaway = new DB({
                discordId: this.member.user.id,
                winners: winners,
                prize: prize,
                messageId: msg.id,
                channel: channel.id,
                endsAt: new Date().getTime() + time
            });
            newGiveaway.save();
            /*
            End the giveaway after the given time
             */
            setTimeout(() => {
                this.drawWinners(msg.id)
            }, time);
        })

    }

    reRollGiveaway(messageId, user) {
        DB.findOne({messageId: messageId}, (err, data) => {
            if (err) console.log(err);
            if (!data) return this.channel.send(new MessageEmbed().setDescription('The message ID is invalid or the ' +
                'giveaway has already ended! \n If you need help finding the message ID feel free to contact any online staff member')
                .setColor('#ff0000').setTimestamp(new Date()));
            const channel = this.guild.channels.cache.get(data.channel);
            if (data.discordId !== this.member.user.id && user.permissionLevel < 2) {
                return this.channel.send(new MessageEmbed().setTimestamp(new Date()).setColor('RED')
                    .setTitle('Error').setDescription('This is not your giveaway. If you need help please DM or Ping a staff member'));
            }
            if (!channel) return this.channel.send(new MessageEmbed().setDescription('The message ID is invalid or the giveaway has already ended! ' +
                '\n If you need help finding the message ID feel free to contact any online staff member')
                .setColor('#ff0000').setTimestamp(new Date()));
            let possible = []; // Possible winners
            channel.messages.fetch(messageId).then(msg => {
                msg.reactions.cache.forEach(reaction => {
                    if (reaction.emoji.name === '🎉') {
                        reaction.users.fetch().then(users => {
                            users.forEach(user => {
                                if (user.bot) return;
                                possible.push(user.id) // Add the user to the possible winners if not a bot
                            });
                            let winner = possible[Math.round(Math.random() * (possible.length - 1))];
                            channel.send(`<@${winner}> is the new winner!`)
                        });
                    }
                });
            }).catch(err => {
                console.log(err);
                channel.send('The message ID is invalid or the giveaway has already ended! \n If you need help finding the message ID feel free to contact any online staff member')
            })
        });
    }

    drawWinners(messageId) {
        DB.findOne({messageId: messageId}, (err, data) => {
            if (err) console.log(err);
            if (!data) return console.log(false);
            const channel = this.client.channels.cache.get(data.channel);
            let possible = []; // Possible winners
            channel.messages.fetch(messageId).then(msg => {
                msg.reactions.cache.forEach(reaction => {
                    if (reaction.emoji.name === '🎉') {
                        reaction.users.fetch().then(users => {
                            users.forEach(user => {
                                if (user.bot) return;
                                possible.push(user.id)
                            });
                            let winners = [];
                            /*
                            Pick the appropriate amount of winners
                             */
                            for (let i = 0; i < data.winners; i++) {
                                let nr = Math.round(Math.random() * (possible.length - 1));
                                winners.push(possible[nr]);
                                possible.splice(nr, 1);
                            }
                            let desc;
                            if (winners.length === 1) {
                                desc = `<@${winners[0]}> just won ${data.prize}!`
                            } else {
                                desc = `<@${winners.join('> \n<@')}> just won ${data.prize}!`
                            }
                            msg.edit(new MessageEmbed()
                                .setTitle(':tada: Giveaway ended! :tada:')
                                .setDescription(`**Prize: ${data.prize}** \nWinners: \n <@${winners.join('>\n <@')}>`)
                                .setFooter(`Ended on the ${this.getTime()}`))
                            channel.send(desc);

                        });
                    }
                });
            }).catch(err => {
                console.log(err);
                channel.send(new MessageEmbed().setTimestamp(new Date()).setTitle('Error').setColor('RED').setDescription('The message ID is invalid or the giveaway has already ended! \n If you need help finding the message ID feel free to contact any online staff member!'))
            })
        });
    }

    endGiveaway(messageId) {
        const DB = require('../models/giveaway');
        DB.findOne({messageId: messageId}, (err, data) => {
            if (data)
                this.drawWinners(messageId);
            data.remove();
        }).catch(() => {
            return this.channel.send(new MessageEmbed().setTimestamp(new Date()).setTitle('Error').setColor('RED').setDescription('The message ID is invalid or the giveaway has already ended! \n If you need help finding the message ID feel free to contact any online staff member!'))
        });
        this.channel.send(new MessageEmbed().setTimestamp(new Date()).setTitle('Success').setColor('GREEN').setDescription('Giveaway ended!'))
    }

    /**
     * Returns a nicely formatted string of the current time
     * @returns {string}
     */
    getTime() {
        Date.prototype.today = function () {
            return ((this.getDate() < 10) ? "0" : "") + this.getDate() + "." + (((this.getMonth() + 1) < 10) ? "0" : "") + (this.getMonth() + 1) + "." + this.getFullYear();
        }
        Date.prototype.timeNow = function () {
            return ((this.getHours() < 10) ? "0" : "") + this.getHours() + ":" + ((this.getMinutes() < 10) ? "0" : "") + this.getMinutes() + ":" + ((this.getSeconds() < 10) ? "0" : "") + this.getSeconds();
        }
        return new Date().today() + " at " + new Date().timeNow();
    }

}

module.exports = GiveawayHelper
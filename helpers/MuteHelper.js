const {MessageEmbed} = require('discord.js');
const ms = require('ms');

class MuteHelper {

    constructor(user, guild, args) {
        this.user = user;
        this.guild = guild;
        this.args = args;
        this.muterole = guild.roles.cache.find(role => role.name === 'Muted');
        this.roles = [];
    }

    async checkMuteRoleExistence() {
        if (!this.muterole) {
            this.muterole = await this.guild.roles.create({
                data: {
                    color: 'DARK_GREY',
                    hoist: false,
                    mentionable: false,
                    name: 'Muted',
                    permissions: []
                },
                reason: 'Create a role for muted'
            })
            this.guild.channels.cache.forEach(channel => {
                channel.updateOverwrite(this.muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false
                })
            })
        }
    }

    unMuteUser() {
        this.user.roles.remove(this.muterole).then(() => {
            return new MessageEmbed().setTitle('Success').setTimestamp(new Date()).setColor('GREEN')
                .setDescription(`${this.user} has been un-muted successfully!`)
        })
    }

    muteUser() {
        this.roles = this.user.roles.cache;
        this.user.roles.remove(this.roles).then(() => {
            this.user.roles.add(this.muterole);
            let time;
            if (this.args.duration) {
                time = ms(this.args.duration + this.args.unit);

                setTimeout(() => {
                    this.user.roles.add(self.roles);
                    this.unMuteUser();
                }, time);
                time = ms(time, {long: true})
            }
            if (!time)
                time = 'permanent';
            return new MessageEmbed().setTitle('Success').setTimestamp(new Date()).setColor('RED')
                .setDescription(`${this.user} has been muted successfully for ${time}!`)
        });
    }

    isMuted() {
        if (this.user.roles)
            return this.user.roles.cache.has(this.muterole.id)
        else
            return false
    }

    async act() {
        await this.checkMuteRoleExistence();
        this.isMuted() ? this.unMuteUser() : this.muteUser();
    }
}

module.exports = MuteHelper;

const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");
const DB = require('../models/user');
const XpHelper = require('../helpers/XpHelper');

class UserCommand extends Base {
    constructor(client) {
        super(client, {
            name: "user",
            aliases: ["userInfo", 'level', 'info'],
            category: "Information",
            description: "Returns important information about you or a given user.",
            usage: "[@User]",
            options: [
                {
                    name: 'user',
                    description: 'The user you want to find out information about',
                    type: 6
                },
            ],
            permissionLevel: 0,
            cooldown: 0,
            currencyCost: 0,

        })
    }

    run() {
        return new Promise(async (resolve) => {

                const xpHelper = new XpHelper(this.member, this.channel);
                if (this.args && this.args.user)
                    this.target = await this.guild.members.cache.get(this.args.user)

                if (!this.target) this.target = this.member;
                let data = await DB.getUser(this.target.id);


                await resolve(new MessageEmbed().setTimestamp(new Date()).setTitle('User Info').setColor("RANDOM").setThumbnail(this.target.user.avatarURL())
                    .addField('Name', this.target.user.tag, true)
                    .addField('User id', this.target.id, true)
                    .addField('Level', await xpHelper.getLevel(data.xp), true)
                    .addField(':scroll:', data.coins, true)
                    .addField('Roles', `${this.target.roles.cache.filter(r => r.id !== this.guild.id).map(roles => `${roles}`).join(" **|** ") || ":x: No Roles"}`, true)
                    .addField('Bot', this.target.user.bot?'✅':'❌', true)
                    .addField('Joined Discord At', this.target.user.createdAt, true));
            }
        );
    }

}

module.exports = UserCommand;

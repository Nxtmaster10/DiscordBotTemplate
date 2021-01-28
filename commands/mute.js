const Base = require("../base/Command");
const TEMPLATE = require('../helpers/MessageHelper');
const MUTEHELPER = require('../helpers/MuteHelper');
const DB = require('../models/user');


class MuteCommand extends Base {
    constructor(client) {
        super(client, {
            name: "mute",
            aliases: ["m", 'unmute'],
            category: "Moderation",
            description: "Mutes or unmutes a user for a given time.",
            usage: "<@User>",
            options: [
                {
                    name: 'user',
                    description: 'The user who gets coins added',
                    required: true,
                    type: 6
                }, {
                    'name': 'duration',
                    description: 'The duration of the giveaway',
                    type: 4,
                },

                {
                    'name': 'unit',
                    description: 'The unit of the duration (days, seconds, ...)',
                    type: 3,
                    choices: [{
                        value: "d",
                        name: "days",
                        type: 3
                    }, {
                        value: "h",
                        name: "hours",
                        type: 3
                    }, {
                        value: "m",
                        name: "minutes",
                        type: 3
                    }, {
                        value: "s",
                        name: "seconds",
                        type: 3
                    },]
                }

                ],
            permissionLevel: 2,
            cooldown: 0,
            currencyCost: 0,
        })
    }

    run(user) {
        return new Promise(async (resolve, reject) => {

            const MESSAGES = new TEMPLATE(this.channel, this.member, this.help);

            let target = await this.guild.members.cache.get(this.args.user)

            let data = await DB.getUser(target.id);
            if ((data && data.permissionLevel >= user.permissionLevel) || (this.args.duration && user.permissionLevel < 2)) {
                MESSAGES.noPermission();
                return reject('No permission')
            }

            const MuteHelper = new MUTEHELPER(target, this.guild, this.args);
            await MuteHelper.act();
            await resolve(null)
        })
    }

}

module.exports = MuteCommand;

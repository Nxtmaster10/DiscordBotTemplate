const {MessageEmbed} = require("discord.js");
const USERS = require('../models/user');
const Base = require("../base/Command");
const TEMPLATE = require('../helpers/MessageHelper');


class PermissionsCommand extends Base {
    constructor(client) {
        super(client, {
            name: "permissions",
            aliases: ["perms", "perm", "perm", "p"],
            category: "Administration",
            description: "Returns or sets the permission level of a user!",
            usage: "<@User> [permissionLevel]",
            options:
                [
                    {
                        "name": "view",
                        "description": "View the permission level of a user",
                        "type": 1, // 2 is type SUB_COMMAND_GROUP
                        "options": [
                            {
                                'name': 'user',
                                description: 'The user you want to view the permission level of',
                                type: 6,
                                required: true
                            }
                        ]
                    },
                    {
                        "name": "set",
                        "description": "Set the permissions of a user",
                        "type": 1,
                        "options": [
                            {
                                "name": "user",
                                "description": "The user you want to set the permission level of",
                                "type": 6,
                                required: true
                            },
                            {
                                "name": "level",
                                "description": "The permission level you want to set the user's to",
                                required: true,
                                "type": 4,
                            },
                        ]

                    }],

            permissionLevel: 2,
            cooldown: 0,
            currencyCost: 0,

        })
    }

    run(user) {
        return new Promise(async (resolve, reject) => {

            const MESSAGES = new TEMPLATE(this.channel, this.member, this.help);

            let target = await this.guild.members.cache.get(this.args.user)

            let data = await USERS.findOne({userId: target.id}).catch(() => {
                MESSAGES.invalidUser();
                return reject('Invalid data')
            });

            if (!user)
                return reject('No user data')
            switch (this.subCommand) {
                case 'view':
                    await resolve(new MessageEmbed().setTimestamp(new Date()).setTitle("Permission level").setDescription(`${target} has a permission level of: ${data.permissionLevel}`).setColor("RANDOM"))
                    break
                case 'set':
                    if (this.args.level >= user.permissionLevel) {
                        await message.channel.send(new MessageEmbed().setTimestamp(new Date()).setTitle('Error').setColor('RED')
                            .setDescription(`You can only assign permissions up to permission level ${user.permissionLevel - 1}!`))
                        return reject('Illegal permission')
                    }

                    if (user.permissionLevel <= data.permissionLevel)
                        return reject(`You can only set the permissions of users below your own permission level!`)

                    if (!data) {
                        const newUser = new USERS({
                            userId: target.id,
                            permissionLevel: level || 0
                        });
                        newUser.save().catch();
                        data = newUser
                    }
                    if (this.args.level < 5 || user.permissionLevel > 10) {
                        data.permissionLevel = this.args.level;
                        data.save();
                        await resolve(new MessageEmbed().setTimestamp(new Date()).setTitle("Permission level").setDescription(`${target} now has a permission level of: ${data.permissionLevel}`).setColor("RANDOM"));
                    } else return reject('The permission level can\'t be greater than 4!');
                    break
            }
        });
    }

}

module.exports = PermissionsCommand;

const ms = require("ms");

const {MessageEmbed} = require("discord.js");
const Base = require("../base/Command");
const GiveawayHelper = require('../helpers/GiveawayHelper');


class GiveawayCommand extends Base {
    constructor(client) {
        super(client, {
            name: "giveaway",
            aliases: ["startGiveaway", 'gwa'],
            category: "Giveaway",
            description: "Starts a new Interactive setup for a giveaway",
            usage: "",
            options: [
                {
                    "name": "create",
                    "description": "Create a new giveaway",
                    "type": 1, // 1 is type SUB_COMMAND
                    "options": [{
                        "name": "channel",
                        required: true,
                        "description": "Channel in which the giveaway should take place",
                        "type": 7,
                    },
                        {
                            'name': 'duration',
                            description: 'The duration of the giveaway',
                            type: 4,
                            required: true
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
                            },],
                            required: true
                        },
                        {
                            'name': 'winners',
                            description: 'The amount of winners',
                            type: 4,
                            required: true
                        },
                        {
                            'name': 'prize',
                            description: 'The prize of the giveaway',
                            type: 3,
                            required: true
                        }
                    ]
                },
                {
                    "name": "reroll",
                    "description": "Rerolls a giveaway",
                    "type": 1,
                    "options": [
                        {
                            "name": "id",
                            "description": "The message-ID of the giveaway",
                            "type": 3,
                            required: true
                        },
                    ]
                },
                {
                    "name": "end",
                    "description": "End your own giveaway",
                    "type": 1,
                    "options": [
                        {
                            "name": "id",
                            "description": "The unique id of the lore",
                            "type": 3,
                            required: true
                        },
                    ]

                }],
            permissionLevel: 0,
            cooldown: 0,
            allowDMs: true
        })
    }

    async run(user) {
        return new Promise((resolve) => {
            const giveawayHelper = new GiveawayHelper(this.client, this.member, this.channel, this.guild);
            switch (this.subCommand) {
                case 'create':
                    let time = ms(this.args.duration + this.args.unit);
                    let channel = this.guild.channels.cache.get(this.args.channel)
                    giveawayHelper.startGiveaway(channel, time, this.args.winners, this.args.prize)
                    resolve(new MessageEmbed().setTimestamp(new Date()).setTitle('Success').setDescription('Giveaway created!')
                        .setColor('GREEN'))
                    break
                case 'reroll':
                    giveawayHelper.reRollGiveaway(this.args.id, user)
                    resolve(new MessageEmbed().setTimestamp(new Date()).setTitle('Success').setDescription('Giveaway rerolled!')
                        .setColor('GREEN'))
                    break
                case 'end':
                    giveawayHelper.endGiveaway(this.args.id)
                    resolve(new MessageEmbed().setTimestamp(new Date()).setTitle('Success').setDescription('Giveaway ended!')
                        .setColor('GREEN'))
                    break
            }

        })
    }

}

module.exports = GiveawayCommand;

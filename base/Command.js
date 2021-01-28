const {APIMessage} = require('discord.js')

class Command {
    /**
     *
     * @param {Client} client
     * @param {Object} options
     */
    constructor(client, options) {
        this.client = client;
        this.help = {
            name: options.name || null,
            description: options.description || "No information specified.",
            usage: options.usage || "",
            category: options.category || "Uncategorized"
        };
        /**
         * The command's configuration
         * @type {Object}
         */
        this.conf = {
            permissionLevel: options.permissionLevel || 0,
            permission: options.permission || "SEND_MESSAGES",
            cooldown: options.cooldown || 0,
            aliases: options.aliases || [],
            args: options.args || [],
            options: options.options || [],
            allowDMs: options.allowDMs || false,
            currencyCost: options.currencyCost || 0,
            keepMessage: options.keepMessage || false
        };
        /**
         * A set of the IDs of the users on cooldown
         * @type {Set}
         */
        this.cooldown = new Set();
        this.args = {};
    }

    /**
     * Puts a user on cooldown
     * @param {String} user The ID of the user to put on cooldown
     */
    startCooldown(user) {
        // Adds the user to the set
        this.cooldown.add(user);

        // Removes the user from the set after the cooldown is done
        setTimeout(() => {
            this.cooldown.delete(user);
        }, this.conf.cooldown);
    }

    setTarget(user) {
        this.target = user;
    }

    setMember(member) {
        this.member = member
    }

    setGuild(guild) {
        this.guild = guild
    }

    setInteraction(interaction) {
        this.interaction = interaction
    }

    setArgument(argument, value) {
        this.args[argument] = value
    }

    setSubcommand(subcommand) {
        this.subCommand = subcommand
    }

    setChannel(channel) {
        this.channel = channel
    }

    async respond(embed) {
        this.target = null;
        this.message = null;
        this.channel = null;
        if (embed) {
            this.client.api.interactions(this.interaction.id, this.interaction.token).callback.post({
                data: {
                    type: 4,
                    data:await this.createAPIMessage(embed)
                }
            })
        }else{
            this.client.api.interactions(this.interaction.id, this.interaction.token).callback.post({
                data: {
                    type: 5,
                }
            })
        }
    }

    async createAPIMessage(content) {
        let message = await APIMessage.create(this.client.channels.resolve(this.interaction.channel_id), content)
            .resolveData().resolveFiles()
        return {...message.data};
    }

}

module.exports = Command;

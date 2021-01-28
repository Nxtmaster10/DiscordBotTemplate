const USERS = require('../models/user')
const {MessageEmbed} = require('discord.js')
const COINS = require('../helpers/CoinHelper');

class InteractionCreateEvent {
    constructor(client) {
        this.client = client;
    }

    async run(interaction) {

        /*
        Extracting the necessary information from the interaction event
         */
        let {guild_id: guildId, channel_id: channelId, data, member: user} = interaction
        let {name, options} = data

        /*
        Fetching the relevant information as the interaction only provides the ids
         */
        let guild = await this.client.guilds.cache.get(guildId);
        let channel = await guild.channels.cache.get(channelId)
        let member = await guild.members.cache.get(user.user.id)

        /*
        Try to find the command in the registered commands
         */
        let cmd = this.client.commands.get(name.toLowerCase()) || this.client.commands.get(this.client.aliases.get(name.toLowerCase()));

        /*
        Get the data of the user from the DB
         */
        let userData = await USERS.getUser(user.user.id);

        /*
        Check for sufficient funds to execute a command (costing coins)
         */
        if (cmd.conf.currencyCost > userData.coins)
            return cmd.respond(new MessageEmbed().setTimestamp(new Date()).setTitle('Error')
                .setColor('RED').setDescription(`This command costs ${cmd.conf.currencyCost} :scroll:, but you only have ${userData.coins} :scroll:.`))

        /*
        Elevate the permissions of a user if they are an admin
         */
        if (member.permissions.cache.has("ADMINISTRATOR") && userData.permissionLevel < 3)
            userData.permissionLevel = 3;

        /*
        Check if the user has sufficient permissions to execute the command
         */
        if (cmd.conf.permissionLevel > userData.permissionLevel)
            return cmd.respond(new MessageEmbed().setTimestamp(new Date()).setTitle('Error')
                .setColor('RED').setDescription(`You have no permission to use that command. If you believe this is an error, DM <@236913544895922188>`))

        /*
        Setting up the command
         */
        cmd.setInteraction(interaction)
        cmd.setMember(member)
        cmd.setGuild(guild)
        cmd.setChannel(channel)

        /*
        Setting the arguments for the command (checking for sub-groups and sub-commands)
         */
        if (options)
            options.forEach(option => {
                if (!option.options)
                    if (option.value)
                        cmd.setArgument(option.name, option.value)
                    else
                        cmd.setSubcommand(option.name)
                else if (option.options) {
                    cmd.setSubcommand(option.name)
                    option.options.forEach(o => {
                        if (!o.option)
                            cmd.setArgument(o.name, o.value)
                    })
                }
            })
        else cmd.args = []

        /*
        Run the command
         */
        let response = await cmd.run(data).catch(err => {
            cmd.respond(new MessageEmbed().setColor('RED').setTimestamp(new Date())
                .setAuthor(member.user.tag, member.user.avatarURL())
                .setTitle('Error!').setDescription(err))
        })

        /*
        Sending the response to the user
         */
        if (response)
            await cmd.respond(response).then(() => {
                const coinHelper = new COINS(cmd);
                coinHelper.removeCoins();
            })

        /*
        Resetting the command's target
         */
        cmd.setTarget(null)


    }


}


module.exports = InteractionCreateEvent;

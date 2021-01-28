const {Client, Collection} = require('discord.js');
const {readdir} = require('fs');
const ascii = require("ascii-table");

class BaseClient extends Client {
    constructor(options) {
        super(options.clientOptions || {});
        /**
         *
         * @type {module:"discord.js".Collection<unknown, unknown>}
         */
        this.commands = new Collection();
        this.aliases = new Collection();
        this.categories = [];
        this.config = options.config ? require(`../${options.config}`) : {}
    }

    login(token) {
        return super.login(token);
    }

    /**
     *  Registers a new slash command
     * @param command
     * @param {String} guildId
     * @returns {Promise<void>}
     */
    async createCommand(command, guildId) {
        this.api.applications(this.user.id).guilds(guildId).commands.post({data: command}).catch(err=>{
            console.log(err)
            console.log(`This happened at ${command.name}`)
        })
    };

    /**
     * Deletes all slash commands of a guild
     * @param {String} guildId
     * @returns {Promise<void>}
     */
    async deleteCommands(guildId) {
        let commands = await this.api.applications(this.user.id).guilds(guildId).commands.get()
        commands.forEach(cmd => {
            this.api.applications(cmd.application_id).guilds(guildId).commands(cmd.id).delete()

        })
    }

    /**
     * Loads all commands into the clients memory
     * @param {String} path
     * @returns {BaseClient}
     */
    loadCommands(path) {
        let table = new ascii("Commands");
        table.setHeading("Command", "Load status");

        readdir(path, (err, files) => {
            if (err) console.error(err);
            files.forEach(cmd => {

                const command = new (require(`../${path}/${cmd}`))(this);
                this.commands.set(command.help.name.toLowerCase(), command);
                if (!this.categories.includes(command.help.category))
                    this.categories.push(command.help.category);
                table.addRow(command.help.name, '✅');
                command.conf.aliases.forEach(a => this.aliases.set(a.toLowerCase(), command.help.name.toLowerCase()));

            });
        });
        console.log(table.toString());

        return this;
    }

    /**
     * Loads all events into the clients memory
     * @param {String} path
     * @returns {BaseClient}
     */
    loadEvents(path) {
        let table = new ascii("Events");
        table.setHeading("Event", "Load status");
        readdir(path, (err, files) => {
            if (err) console.log(err);
            files.forEach(evt => {
                const event = new (require(`../${path}/${evt}`))(this);
                table.addRow(evt, '✅');
                super.on(evt.split(".")[0], (...args) => event.run(...args));
            });
        });
        console.log(table.toString());
        return this;
    }

}

module.exports = BaseClient;

const Client = require("./base/Client");
const mongoose = require('mongoose');
const {config} = require("dotenv");
config({
    path: "./.env"
});


const client = new Client({
    config: "./config",
    clientOptions: {
        partials: ['MESSAGE', 'REACTION', "CHANNEL", "GUILD_MEMBER"],
        token: process.env.TOKEN,
    }
});

mongoose.connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

client.loadCommands(client.config.paths.commands);

client.loadEvents(client.config.paths.events);

client.login(process.env.TOKEN).then(async () => {
    /*
    Get all the registered commands, if the amount of registered commands differs from the commands that are present,
    all commands will be re-registered
     */
    let commandsCreated = await client.api.applications(client.user.id).guilds("604245097252519947").commands.get();
    if (client.commands.length !== commandsCreated.length) {
        await client.deleteCommands("604245097252519947");
        client.commands.forEach(command => {
            client.createCommand({
                name: command.help.name,
                description: command.help.description,
                options: command.conf.options,
            }, "604245097252519947")
        })
    }
});

client.ws.on('INTERACTION_CREATE', async interaction => {
    client.emit('interactionCreate', interaction)
})
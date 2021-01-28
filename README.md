# Bot Template
This is a template for a Discord bot using [DiscordJS](https://discord.js.org) and [Discord's new slash commands](https://discord.com/developers/docs/interactions/slash-commands)

The bot uses a custom permission system and a user management with coins and levels using MongoDB/mongoose.


## Commands

All commands should be in the command path specified in your [config.json](config.json) (default is ./commands)

### Structure of an example command:

Name: The name of the command

Category: The category of the command (deprecated) - default: Uncategorized

Options: The slash command options [More on the Options](https://discord.com/developers/docs/interactions/slash-commands#applicationcommandoption) - default: []

Permission level: The minimum required permission level to execute the command (default levels are 0 - 4 but you can adjust them manually) - default: 0

Currency cost: How much the command costs - default: 0

```js
const Base = require("../base/Command");

class ExampleCommand extends Base {
    constructor(client) {
        super(client, {
            name: "exampleName",
            category: "ExampleCategory",
            options: [
                {
                    "name": "example_option",
                    "description": "Example option description",
                    "type": 3,  // Type 3 is string
            }],
            description: "Example commad description.",
            permissionLevel: 2,
            currencyCost: 10,
        })
    }
```
### Execution of the command:

The run function gets the data of the user passed as an argument.

The command should resolve the string or embed you want to return to the user.

The options passed by the user can be accessed via `this.args`

```js
    run(userData) {
        return new Promise(async (resolve, reject) => {
            resolve(`Example Option: ${this.args.example_option}, Current coins: ${userData.coins}`)
        })
    }

}

module.exports = ExampleCommand;
```


## Events

All events should be in the command path specified in your [config.json](config.json) (default is ./events)

The name of the file specifies the name of the event (**Case sensitive**)

The event gets passed all the parameters - in this case it's only the message one

```js
const Base = require("../base/Command");

class MessageEvent extends Base {
    constructor(client) {
      this.client = client;
    }

    run(message) {
        if(message.content.includes('beep'))
          message.reply("boop)
    }

}

module.exports = MessageEvent;
```

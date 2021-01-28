class MessageReactionAddEvent {
    constructor(client) {
        this.client = client
    }

    async run(reaction) {

        /*
        If the message that the user reacted is not cached, fetch it
         */
        if (reaction.message.partial) {
            try {
                await reaction.fetch();
                await reaction.message.fetch();
            } catch (err) {
                console.log(err);
            }
        }
        /*
        Do something with the reaction here
         */

    }
}

module.exports = MessageReactionAddEvent;

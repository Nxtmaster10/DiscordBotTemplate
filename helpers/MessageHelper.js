const {MessageEmbed} = require('discord.js');

class MessageHelper {
    constructor(channel, member, command) {
        this.channel = channel
        this.member = member
        this.command = command;
    }

    noPermission() {
        this.channel.send(new MessageEmbed().setColor('RED').setTimestamp(new Date())
            .setAuthor(this.member.user.tag, this.member.user.avatarURL())
            .setTitle('Error!')
            .setDescription('You don\'t have enough permission to use this command!'))
    }

    missingArguments() {
        this.channel.send(new MessageEmbed().setColor('RED').setTimestamp(new Date())
            .setAuthor(this.member.user.tag, this.member.user.avatarURL())
            .setTitle('Error!')
            .setDescription(`You didn't provide enough information!\n Please use !${this.command.name} ${this.command.usage}`))
    }

    invalidUser() {
        this.channel.send(new MessageEmbed().setColor('RED').setTimestamp(new Date())
            .setAuthor(this.member.user.tag, this.member.user.avatarURL())
            .setTitle('Error!')
            .setDescription(`I couldn't find this user :sob: Check spelling!`))
    }

    noData() {
        this.channel.send(new MessageEmbed().setColor('RED').setTimestamp(new Date())
            .setAuthor(this.member.user.tag, this.member.user.avatarURL())
            .setTitle('Error!')
            .setDescription(`There was no data found for this in the DB!`))
    }

    /**
     * Awaits answers to all questions provided
     * @param {String} topic
     * @param {String} description
     * @param {[String]} questions
     * @returns {Promise<[String]>}
     */
    awaitMessages(topic, description, questions) {
        let fields = [];
        return new Promise(async (resolve, reject) => {
                let answers = [];
                const filter = m => m.author.id === this.member.user.id;
                let msg = await this.member.send(new MessageEmbed().setTimestamp(new Date()).setColor('DARK_VIVID_PINK').setTitle(topic).setDescription(description));
                let index = 1;
                for (const question of questions) {
                    await fields.push({
                        name: question,
                        value: 'Enter your answer below',
                        inline: true
                    });
                    let newMessage = await msg.channel.send(new MessageEmbed().setTimestamp(new Date()).setTitle(topic).setColor('ORANGE').addFields(fields)
                        .setFooter(`Question ${index}/${questions.length}`));
                    await msg.channel.awaitMessages(filter, {time: 1000000, max: 1,}).then(collected => {
                        answers.push(collected.first().content);

                    }).catch(err => {
                        return reject(err)
                    });
                    await fields.pop();
                    await fields.push({
                        name: question,
                        value: answers[index - 1],
                        inline: true
                    })
                    if (index > questions.length)
                        await msg.channel.send(new MessageEmbed().setTimestamp(new Date()).setTitle(topic).setColor('ORANGE').addFields(fields));
                    await newMessage.delete();
                    index++;
                }
                await resolve(answers)
            }
        )
    }


}

module.exports = MessageHelper;

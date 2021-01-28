const Base = require("../base/Command");


class EvalCommand extends Base {
    constructor(client) {
        super(client, {
            name: "Eval",
            aliases: ["eval"],
            category: "Administrator",
            description: "If you know, you know",
            usage: "",
            options: [
                {
                    name: 'command',
                    description: 'The eval to get executed',
                    required: true,
                    type: 3
                },],
            permissionLevel: 10,
            cooldown: 0,
            keepMessage: true
        })
        this.client = client
    }

    run() {


        const clean = text => {
            if (typeof (text) === "string")
                return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
            else
                return text;
        }
        return new Promise(async (resolve, reject) => {

            try {
                let evaluated = eval(this.args.code);

                if (typeof evaluated !== "string")
                    evaluated = require("util").inspect(evaluated);

                await resolve(clean(evaluated), {code: "xl"});
            } catch (err) {
                reject(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
            }
        })
    }

}

module.exports = EvalCommand;

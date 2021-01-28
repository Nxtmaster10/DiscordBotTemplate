const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ignSchema = new Schema({
    discordId: {type: String, required: true},
    messageId: {type: String,  required: true},
    prize: {type: String,  required: true},
    winners: {type: Number,  required: true},
    channel: {type: String, required: true},
    endsAt: {type: Date}


}, {collection: 'Giveaways'});



const GiveawayModel = mongoose.model("Giveaways", ignSchema);

GiveawayModel.getAll = () => {
    return new Promise(async (resolve) => {
        let giveaways = await GiveawayModel.find({});
        resolve(giveaways)
    })
};

module.exports = GiveawayModel;
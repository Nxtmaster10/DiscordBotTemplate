const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    userId: {type: String, required: true},
    permissionLevel: {type: Number, default: 0},
    xp: {type: Number, default: 0},
    coins: {type: Number, default: 0}
}, {collection: 'Users'});

let UserModel = mongoose.model('Users', UserSchema);

UserModel.getAll = () => {
    return UserModel.find({});
};


UserModel.addUser = (userToAdd) => {
    return new Promise((resolve) => {
        let user = new UserModel({
            userId: userToAdd,
            xp: 0,
            coins: 0
        });
        user.save();
        resolve(user);
    })

};

UserModel.getUser = (userId) => {
    return new Promise(async (resolve) => {
        let data = await UserModel.findOne({userId: userId}).catch(err => console.log(err))

        if (!data)
            data = await UserModel.addUser(userId);
        resolve(data);


    })

};

UserModel.removeUser = (userId) => {
    return UserModel.remove({userId: userId});
};

module.exports = UserModel;

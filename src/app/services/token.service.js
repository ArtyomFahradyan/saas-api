import mongoose from 'mongoose';
const Token = mongoose.model('Token');

export class TokenService {

    constructor() { }

    static async create(tokenInfo) {
        return await Token.create(tokenInfo);
    }

    static async update(_id, data) {
        const options = { new: true };

        return await Token.findOneAndUpdate({ _id }, data, options);
    }

    static async getByUserId(user) {
        return await Token.findOne({ user });
    }

    static async deleteByToken(token) {
        return await Token.findOneAndDelete({ token });
    }
}

import mongoose from 'mongoose';
const Team = mongoose.model('Team');
import _ from 'lodash';

export class TeamService {
    constructor() { }

    static async getById(_id) {
        return await Team.findOne({ _id });
    }

    static async getTeams(account) {
        return await Team.find({
            $or: [
                { isCustom: false },
                { account }
            ]
        }).collation({ locale: 'en' })
                .sort({ name: 1 });
    }

    static async getDefaultTeams() {
        return await Team.find({ isCustom: false })
                .collation({ locale: 'en' })
                .sort({ name: 1 });
    }

    static async getAll() {
        const teams = await Team.find();
        let names = [];

        teams.forEach(team => {
            names.push(team.name);
        });

        return _.sortedUniq(names);
    }

    static async create(data) {
        return await Team.create(data);
    }

    static async getByAccountId(account) {
        return await Team.findOne({ account });
    }

    static async update(_id, attributes) {
        const options = { new: true };

        return Team.findOneAndUpdate({ _id }, attributes, options);
    }
}

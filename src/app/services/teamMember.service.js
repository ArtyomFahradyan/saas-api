import mongoose from 'mongoose';
import { NotFound } from '../errors';
import { NOT_EXISTS } from '../configs/constants';
import Utils from '../helpers/utils';

const TeamMember = mongoose.model('TeamMember');

export class TeamMemberService {
    constructor() { }

    static sort(query, options) {
        switch (options.sort) {
                case 'fName':
                    if (options.dir === 'asc') {
                        query.push({ $sort: { 'firstName': 1 } });
                    } else if (options.dir === 'desc') {
                        query.push({ $sort: { 'firstName': -1 } });
                    }
                    break;
                case 'lName':
                    if (options.dir === 'asc') {
                        query.push({ $sort: { 'lastName': 1 } });
                    } else if (options.dir === 'desc') {
                        query.push({ $sort: { 'lastName': -1 } });
                    }
                    break;
                case 'email':
                    if (options.dir === 'asc') {
                        query.push({ $sort: { 'email': 1 } });
                    } else if (options.dir === 'desc') {
                        query.push({ $sort: { 'email': -1 } });
                    }
                    break;
        }
    }

    static search(query, options) {
        options.q = Utils.escapeRegexSpecialCharacters(options.q);
        query.push({
            $match: { $or: [{ 'firstName': new RegExp(options.q, 'i') },
                { $or: [{ 'lastName': new RegExp(options.q, 'i') },
                    { 'email': new RegExp(options.q, 'i') }] }] }
        });
    }

    static async create(data) {
        return await TeamMember.create(data);
    }

    static async getById(_id) {
        let member = await TeamMember.findOne({ _id });

        if (!member) {
            throw new NotFound(NOT_EXISTS('Team Member'));
        }

        return member;
    }

    static async getByParams(params, options) {
        const { account, team } = params;
        const size = Number(options.size) || 10;
        const offset = Number(options.offset) || 0;
        let query = [];

        query.push(
            { $match: {  $and: [{ account: account }, { team: team }] } }
        );

        if (options.q) {
            this.search(query, options);
        }

        if (options.sort && options.dir) {
            this.sort(query, options);
        }

        query.push(
            { $group: { _id: null, teamMembers: { $push: '$$ROOT' },count: { $sum: 1 } } },
            { $project: { teamMembers: { $slice: [ '$teamMembers', offset * size, size ] },
                count: 1, _id: 0 } }
        );

        const result = await TeamMember.aggregate(query);

        return result[0] ? result[0] : { count: 0, teamMembers: [] } ;
    }

    static async findByEmail(email, team) {
        return await TeamMember.findOne({ email, team });
    }

    static async edit(_id, attributes) {
        const options = { new: true };

        return await TeamMember.findOneAndUpdate({ _id }, attributes, options);
    }

    static async delete(_id) {
        return await TeamMember.findOneAndDelete({ _id });
    }

}

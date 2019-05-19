import mongoose from 'mongoose';
const Transaction = mongoose.model('Transaction');
const Contract = mongoose.model('Contract');
const Platform = mongoose.model('Platform');

export class TransactionService {
    constructor() { }

    static async create(array, cost, contractId) {
        const contract = await Contract.findOne( { _id: contractId });
        const platform = await Platform.findOne( { _id: contract.platform });

        return await Transaction.create({ paymentDate: array, cost, contract: contractId, platformName: platform.name });
    }

    static async delete(contractId) {
        return Transaction.findOneAndDelete({ contract: contractId });
    }

    static async getById(_id) {
        return await Transaction.findOne({ _id });
    }
}

export default (mongoose) => {
    let TransactionSchema = mongoose.Schema({
        contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true, index: true },
        platformName: { type: String, re: true },
        paymentDate: [{ type: Date, required: true }],
        cost: { type: Number, required: true },
        createdAt: Date,
        updatedAt: Date
    });

    TransactionSchema.pre('update', function() {
        this.update({},{ $set: { updatedAt: new Date() } });
    });

    TransactionSchema.pre('save', function (next) {
        const now = new Date();

        this.updatedAt = now;

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    return mongoose.model('Transaction', TransactionSchema);
};

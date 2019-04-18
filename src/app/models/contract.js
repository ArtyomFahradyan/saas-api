export default (mongoose) => {
    let ContractSchema = mongoose.Schema({
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
        platform: { type: mongoose.Schema.Types.ObjectId, ref: 'Platform', index: true },
        team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', index: true },
        startedAt: { type: Date, required: true },
        endedAt: Date,
        renewalAt: { type: Date, required: true },
        price: { type: Number, required: true },
        paidUsersCount: { type: Number, default: 0 },
        freeUsersCount: { type: Number, default: 0 },
        paidEmailsSentCount: { type: Number, default: 0 },
        freeEmailsSentCount: { type: Number, default: 0 },
        paidProjectsCount: { type: Number, default: 0 },
        freeProjectsCount: { type: Number, default: 0 },
        trialPeriod: Number,
        paidSupportTier: Number,
        freeSupportTier: Number,
        usage: { type: String, enum: ['Small', 'Medium', 'Large'], default: 'Small', required: true, index: true },
        notes: String,
        customField: mongoose.Schema.Types.Mixed,
        isDeleted: { type: Boolean, default: false },
        createdAt: Date,
        updatedAt: Date
    });

    ContractSchema.pre('save', function (next) {
        const now = new Date();

        this.updatedAt = now;

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    return mongoose.model('Contract', ContractSchema);
};


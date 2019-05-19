export default (mongoose) => {
    let ContractSchema = mongoose.Schema({
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
        platform: { type: mongoose.Schema.Types.ObjectId, ref: 'Platform', index: true },
        team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', index: true },
        startedAt: { type: Date, required: true },
        endedAt: { type: Date, required: true },
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
        usage: { type: String, enum: [ 'Small', 'Medium', 'Large' ], default: 'Small', required: true, index: true },
        attachment: { type: mongoose.Schema.Types.ObjectId, ref: 'Filesystem', index: true, required: true },
        notes: String,
        customField: mongoose.Schema.Types.Mixed,
        paymentFrequency: { type: String, enum: [ 'Monthly', 'Quarterly', 'Semi-Annually', 'Annually' ], required: true },
        paymentTerms: { type: Number, enum: [ 7, 15, 30, 45, 60, 90, 120 ], required: true },
        isDeleted: { type: Boolean, default: false },
        createdAt: Date,
        updatedAt: Date
    });

    ContractSchema.pre('update', function() {
        this.update({},{ $set: { updatedAt: new Date() } });
    });

    ContractSchema.pre('save', function (next) {
        const now = new Date();

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    return mongoose.model('Contract', ContractSchema);
};


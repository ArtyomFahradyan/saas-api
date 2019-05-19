export default (mongoose) => {
    let AccountSchema = mongoose.Schema({
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        company: { type: String, required: true, unique: true },
        team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
        reminder: { type: Number, enum: [ 1, 2, 3 ], default: 1 },
        contractsCount: { type: Number, default: 0 },
        adminsCount: { type: Number, default: 0 },
        teamMembersCount: { type: Number, default: 0 },
        lastLogin: Date,
        annualSpend: { type: Number },
        attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Filesystem' }],
        fiscalYearStartAt: { type: Number, enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
        createdAt: Date,
        updatedAt: Date
    });

    AccountSchema.pre('update', function() {
        this.update({},{ $set: { updatedAt: new Date() } });
    });

    AccountSchema.pre('save', function (next) {
        const now = new Date();

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    return mongoose.model('Account', AccountSchema);
};

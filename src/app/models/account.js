export default (mongoose) => {
    let AccountSchema = mongoose.Schema({
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        company: { type: String, required: true, unique: true },
        team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
        contractsCount: { type: Number, default: 0 },
        adminsCount: { type: Number, default: 0 },
        teamMembersCount: { type: Number, default: 0 },
        lastLogin: Date,
        annualSpend: { type: Number },
        attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Filesystem' }],
        createdAt: Date,
        updatedAt: Date
    });

    AccountSchema.pre('save', function (next) {
        const now = new Date();

        this.updatedAt = now;

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    return mongoose.model('Account', AccountSchema);
}

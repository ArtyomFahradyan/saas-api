export default (mongoose) => {
    let TeamMemberSchema = mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
        createdAt: Date,
        updatedAt: Date
    });

    TeamMemberSchema.pre('save', function (next) {
        const now = new Date();

        this.updatedAt = now;

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    return mongoose.model('TeamMember', TeamMemberSchema);
};

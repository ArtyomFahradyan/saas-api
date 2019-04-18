export default (mongoose) => {
    let NotificationSchema = mongoose.Schema({
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
        contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true, index: true },
        notes: { type: String, required: true },
        seen: { type: Boolean, default: false },
        createdAt: Date,
        updatedAt: Date
    });

    NotificationSchema.pre('save', function (next) {
        const now = new Date();

        this.updatedAt = now;

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    return mongoose.model('Notification', NotificationSchema);
};

export default (mongoose) => {
    let FilesystemSchema = mongoose.Schema({
        fileName: { type: String, required: true },
        alias: { type: String },
        location: { type: String, required: true },
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, index: true },
        contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract' },
        isDownloaded: { type: Boolean, default: false },
        createdAt: Date,
        updatedAt: Date
    });

    FilesystemSchema.pre('save', function (next) {
        const now = new Date();

        this.updatedAt = now;

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    return mongoose.model('Filesystem', FilesystemSchema);
};

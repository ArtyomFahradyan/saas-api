export default (mongoose) => {
    let FilesystemSchema = mongoose.Schema({
        fileName: { type: String, required: true, unique: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
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

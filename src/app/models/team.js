export default (mongoose) => {
    let TeamSchema = mongoose.Schema({
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true },
        name: { type: String, required: true },
        isCustom: { type: Boolean, default: true }
    });

    return mongoose.model('Team', TeamSchema);
};


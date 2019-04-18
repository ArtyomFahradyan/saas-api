export default (mongoose) => {
    let TokenSchema = mongoose.Schema({
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        token: { type: String, required: true, index: true },
        expirationDate: { type: Date, required: true }
    });

    return mongoose.model('Token', TokenSchema);
};

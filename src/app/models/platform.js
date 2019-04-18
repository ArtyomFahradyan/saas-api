export default (mongoose) => {
    let PlatformSchema = mongoose.Schema({
        name: { type: String, required: true, index: true },
        isCustom: { type: Boolean, default: true },
        avgSmallPrice: { type: Number, default: 0 },
        avgMediumPrice: { type: Number, default: 0 },
        avgLargePrice: { type: Number, default: 0 }
    });

    return mongoose.model('Platform', PlatformSchema);
};


import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export default (mongoose) => {
    let UserSchema = mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, index: true, unique: true },
        account: { type: mongoose.Schema.Types.ObjectId, ref: 'Account' },
        password: { type: String },
        emailVerified: { type: Boolean, default: false },
        isAccountOwner: { type: Boolean, default: false },
        createdBy: { type: mongoose.Schema.Types.ObjectId, index: true },
        createdAt: Date,
        updatedAt: Date
    });

    UserSchema.pre('save', function(next) {
        const now = new Date();

        this.updatedAt = now;

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    UserSchema.methods = {
        generatePassword: function setUserPassword(pw) {
            return hashSync(pw, genSaltSync(8));
        },

        setPassword: function setUserPassword(pw) {
            this.password = hashSync(pw, genSaltSync(8));
        },

        comparePassword: function checkUserPassword(pw) {
            return this.password && compareSync(pw, this.password);
        },
    };

    return mongoose.model('User', UserSchema);
};

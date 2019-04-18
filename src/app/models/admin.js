import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export default (mongoose) => {
    let AdminSchema = mongoose.Schema({
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, index: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['MA', 'A'], default: 'A', required: true },
        createdAt: Date,
        updatedAt: Date
    });

    AdminSchema.pre('save', function(next) {
        const now = new Date();

        this.updatedAt = now;

        if (!this.createdAt) {
            this.createdAt = now;
        }

        next();
    });

    AdminSchema.methods = {
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

    return mongoose.model('Admin', AdminSchema);
};

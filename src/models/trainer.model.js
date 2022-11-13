const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Settings = require('../config/settings.js');

const trainerSchema = mongoose.Schema(
    {
        trainername: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        fullname: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (
                    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
                        value
                    ) == false
                ) {
                    throw new Error('Invalid email');
                }
            },
        },
        password: {
            type: String,
            required: true,
            minlength: 4,
            validate(value) {
                if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                    throw new Error(
                        'Password must contain at least one letter and one number'
                    );
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

/**
 * Remove sensitive data
 */
trainerSchema.methods.toJSON = function () {
    const trainer = this;
    const trainerObject = trainer.toObject();

    delete trainerObject.password;
    delete trainerObject.tokens;

    return trainerObject;
};

trainerSchema.methods.createAuthToken = async function () {
    const trainer = this;
    const token = jwt.sign(
        { _id: trainer._id.toString() },
        Settings.SecretToken
    );

    //Save Auth token in the DB
    trainer.tokens.push({ token });
    await trainer.save();

    return token;
};

trainerSchema.statics.findByCredentials = async (email, password) => {
    const trainer = await Trainer.findOne({ email });
    if (!trainer) {
        throw new Error('Unable to login');
    }

    const doesPasswordMatch = await bcrypt.compare(password, trainer.password);
    if (!doesPasswordMatch) {
        throw new Error('Unable to login');
    }

    return trainer;
};

/**
 * Check if email is taken
 * @param {string} email - The trainer's email
 * @returns {Promise<boolean>}
 */
trainerSchema.statics.isEmailTaken = async function (email) {
    const trainer = await this.findOne({ email });
    return !!trainer;
};

/**
 * Check if password matches the trainer's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
trainerSchema.methods.isPasswordMatch = async function (password) {
    const trainer = this;
    return bcrypt.compare(password, trainer.password);
};

trainerSchema.pre('save', async function (next) {
    const trainer = this;
    if (trainer.isModified('password')) {
        trainer.password = await bcrypt.hash(trainer.password, 8);
    }
    next();
});

/**
 * @typedef Trainer
 */
const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;

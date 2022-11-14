const mongoose = require('mongoose');

const pokemonSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    alias: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    weakness: {
        type: String,
        required: true,
    },
    hp: {
        type: Number,
        required: true,
        min: 0,
    },
    atk: {
        type: Number,
        required: true,
        min: 0,
    },
    def: {
        type: Number,
        required: true,
        min: 0,
    },
});

/**
 * @typedef Pokemon
 */
const Pokemon = mongoose.model('Pokemon', pokemonSchema);

module.exports = Pokemon;

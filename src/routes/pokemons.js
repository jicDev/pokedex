const { Router } = require('express');
const router = Router();
const auth = require('../middlewares/auth');

const { Pokemon } = require('../models');

router.get('/', auth, async (req, res) => {
    try {
        const pokemons = await Pokemon.find();
        res.send({ pokemons });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const pokemon = new Pokemon(req.body);
        await pokemon.save();
        res.status(201);
        res.send(pokemon);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.delete('/:name', auth, async (req, res) => {
    try {
        const pokemon = await Pokemon.findOneAndDelete({
            name: req.params.name,
        });
        if (!pokemon) {
            return res.status(404).send();
        }
        res.send(pokemon);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:name', auth, async (req, res) => {
    try {
        const pokemon = await Pokemon.findOne({ name: req.params.name });
        if (!pokemon) {
            return res.status(404).send();
        }

        if (req.body.alias) {
            pokemon.alias = req.body.alias;
        }

        await pokemon.save();
        res.send(pokemon);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;

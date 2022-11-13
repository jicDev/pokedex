const { Router } = require('express');
const router = Router();
const auth = require('../middlewares/auth');

const { Trainer } = require('../models');

router.post('/register', async (req, res) => {
    try {
        const trainer = new Trainer(req.body);
        await trainer.save();
        const token = await trainer.createAuthToken();
        res.send({ trainer, token });
    } catch (error) {
        if (error.code == 11000) {
            res.status(400).send('The trainername or email is already taken.');
        } else {
            res.status(400).send(error);
        }
    }
});

router.post('/login', async (req, res) => {
    try {
        const trainer = await Trainer.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await trainer.createAuthToken();
        res.send({ trainer, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/logout', auth, async (req, res) => {
    try {
        req.trainer.tokens = req.trainer.tokens.filter((token) => {
            return token.token !== req.token;
        });
        await req.trainer.save();
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

module.exports = router;

const { Router } = require('express');
const router = Router();
const auth = require('../middlewares/auth');

const { Trainer } = require('../models');

router.get('/', auth, async (req, res) => {
    try {
        const trainers = await Trainer.find();
        res.send({ trainers });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const trainer = new Trainer(req.body);
        await trainer.save();
        res.status(201);
        res.send(trainer);
    } catch (error) {
        if (error.code == 11000) {
            res.status(400).send('The trainername or email is already taken.');
        } else {
            res.status(400).send(error);
        }
    }
});

router.delete('/:trainername', auth, async (req, res) => {
    try {
        const trainer = await Trainer.findOneAndDelete({
            trainername: req.params.trainername,
        });
        if (!trainer) {
            return res.status(404).send();
        }
        res.send(trainer);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.put('/:trainername', auth, async (req, res) => {
    try {
        const trainer = await Trainer.findOne({
            trainername: req.params.trainername,
        });
        if (!trainer) {
            return res.status(404).send();
        }

        if (req.body.fullname) {
            trainer.fullname = req.body.fullname;
        }
        if (req.body.password) {
            trainer.password = req.body.password;
        }

        await trainer.save();
        res.send(trainer);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;

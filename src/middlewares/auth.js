const jwt = require('jsonwebtoken');

const { Trainer } = require('../models');
const Settings = require('../config/settings.js');

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '');
        const decoded = jwt.verify(token, Settings.SecretToken);
        const trainer = await Trainer.findOne({
            _id: decoded._id,
            'tokens.token': token,
        });
        if (!trainer) {
            throw new Error();
        }

        req.token = token;
        req.trainer = trainer;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).send({ error: 'Your session has expired.' });
    }
};

module.exports = auth;

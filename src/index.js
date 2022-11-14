const mongoose = require('mongoose');
const express = require('express');
const app = express();
const morgan = require('morgan');

// Settings
// Cloud port or localhost.
app.set('port', process.env.PORT || 80);
// Format the json objects.
app.set('json spaces', 2);

// Middleware
// Log response server info on the terminal.
if (process.env.ENV == 'develop') {
    app.use(morgan('dev'));
}
// Let the server receive and interpret request objects as strings or arrays.
app.use(express.urlencoded({ extended: false }));
// Let the server receive and interpret request objects as json objects.
app.use(express.json());

// Routes
app.use(require('./routes/index'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/trainers', require('./routes/trainers'));
app.use('/api/pokemons', require('./routes/pokemons'));

// Server
const MONGO = {
    url: 'mongodb://localhost:27017/Pokedex',
};
mongoose.connect(MONGO.url, MONGO.options).then(() => {
    app.listen(app.get('port'), () => {
        console.log(`Server on port ${app.get('port')}`);
    });
});

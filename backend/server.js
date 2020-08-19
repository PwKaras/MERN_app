const express = require('express');;
const bodyPraser = require('body-parser');

const placesRouter = require('./routes/places-routes');
// const usersRouter = require('./routes/users-routes');

const app = express();

app.use('/api/places', placesRouter);
// app.use('/api/places/user', usersRouter);

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occured!' });
});


app.listen(5050);
const express = require('express');
const bodyPraser = require('body-parser');

const HttpError = require('./models/http-error');

const placesRoutes = require('./routes/places-routes');
// const usersRouter = require('./routes/users-routes');

const app = express();

app.use(bodyPraser.json());

app.use('/api/places', placesRoutes);

//it runs only if any of routes above didn`t get responds 
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

// app.use('/api/places/user', usersRouter);

app.use((error, req, res, next) => {
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occured!' });
});


app.listen(5050);
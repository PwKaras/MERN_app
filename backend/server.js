const express = require('express');
const bodyPraser = require('body-parser');
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const mongoConnect = require('./config/mongo');

const placesRoutes = require('./routes/places-routes');
const usersRouter = require('./routes/users-routes');

const HttpError = require('./models/http-error');
const { profileEnd } = require('console');

const app = express();

app.use(bodyPraser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next()
})

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRouter);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});


app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (error) => {
            console.log(error);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'An unknown error occured!' });
});

const LOCAL_PORT = process.env.LOCAL_PORT;
const LOCAL_HOST = process.env.LOCAL_HOST;
const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT || LOCAL_PORT , LOCAL_HOST, () => {
    console.log(`Listening on http://${LOCAL_HOST}:${PORT || LOCAL_PORT}`)
});
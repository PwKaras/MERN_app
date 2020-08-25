const express = require('express');
const bodyPraser = require('body-parser');
const mongoose = require('mongoose');
const mongoConnect = require('./config/mongo');


const placesRoutes = require('./routes/places-routes');
const usersRouter = require('./routes/users-routes');

const HttpError = require('./models/http-error');

const app = express();

app.use(bodyPraser.json());

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRouter);

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


const PORT = process.env.PORT;
const HOST = process.env.HOST;

app.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`)
});

// mongoose.connect('mongodb+srv://pwkaras:ilVsyVTIPdL6ULTV@cluster0.asa7a.mongodb.net/places?retryWrites=true&w=majority',
//     {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//     .then(
//         () => {
//             app.listen(5050);
//         })
//     .catch(
//         err => {
//             console.log(err);
//         });
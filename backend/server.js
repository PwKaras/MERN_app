const express = require('express');
const bodyPraser = require('body-parser');
// fs file system allows interact with files -conected with upload files unlink() method
const fs = require('fs');
const path = require('path');

const mongoose = require('mongoose');
const mongoConnect = require('./config/mongo');

const placesRoutes = require('./routes/places-routes');
const usersRouter = require('./routes/users-routes');

const HttpError = require('./models/http-error');

const app = express();

app.use(bodyPraser.json());

// file uploads - express.static() return requested file
//files form path.join() are returned on request 
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// add this headers to all routes below
app.use((req, res, next) => {
    // allows any (*) domain to send request 
    res.setHeader('Access-Control-Allow-Origin', '*');
    // what headers this request send by the bowser may have
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    //which method
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next()
})

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRouter);

//it runs only if any of routes above didn`t get responds 
app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

// app.use('/api/places/user', usersRouter);

// error
app.use((error, req, res, next) => {
    // if error and file exist, delete file conected with this req
    // file - property aded with multer
    if (req.file) {
        // unlink - delete; path - property of file
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
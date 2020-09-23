const mongoose = require('mongoose');

const mongoConnect = mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.asa7a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => {
    console.log(`connected mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.asa7a.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
});

module.exports = mongoConnect
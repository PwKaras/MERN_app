const mongoose = require('mongoose');

const mongoConnect = mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    seCreateIndex: true
}).then(() => {
    console.log(`connected ${process.env.MONGO_DB}`)
});

module.exports = mongoConnect
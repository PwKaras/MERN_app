const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')

// const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // unique: true - creat index to speeds up querying process
    email: { type: String, required: true, unique: true },
    // select: false - hide password from results
    password: { type: String, required: true, minlength: 6, select: false, },
    image: { type: String, required: true },
    places: [{ type:mongoose.Types.ObjectId, ref: 'Place', required: true }]
});

//uniqueValidator check for duplicate database entries requires as unique
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
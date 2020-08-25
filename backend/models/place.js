const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: { type: String, require: true },
    description: { type: String, require: true },
    // working with database image is always URL - question of executing queries as fast as possible
    image: { type: String, require: true },
    address: { type: String, require: true },
    location: {
        lat: { type: Number, require: true },
        lng: { type: Number, require: true }
    },
    creator: { type: String, require: true }
});

module.exports = mongoose.model('Place', placeSchema);

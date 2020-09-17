const { validationResult } = require(`express-validator`);
const fs = require('fs');

const HttpError = require('../models/http-error');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');


const getAllPlaces = async (req, res, next) => {
    let places;
    // const { limit, page } = req.query;
    const limit = parseInt(req.query.limit);
    const page = parseInt(req.query.page);

    try {
        places = await Place.find()
            .limit(limit)
            .skip(limit * (page - 1))
    } catch (error) {
        return next(new HttpError('Fetching places failed, please try again later.', 500));
    };
    if (!places || places.length === 0) {
        return next(
            new HttpError('Could not find any place.', 404)
        );
    };

    res.status(200).json({ places: places.map(place => place.toObject({ getters: true })) });
};

const getPlacesById = async (req, res, next) => {
    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId);
    } catch (err) {
        return next(new HttpError('Fetching places failed, please try again later.', 500));
    };
    if (!place) {
        return next(
            new HttpError('Could not find a place for the provided id.', 404)
        );
    };

    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const updatePlacesById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() })
    };
    const { newTitle, newDescription } = req.body;
    const placeId = req.params.pid;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(new HttpError('Fetching places failed, please try again later.', 500));
    };

    if (place.creator.toString() !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to edit this place.', 401
        );
        return next(error);
    };

    let updatedPlace;
    try {
        updatedPlace = await Place.updateOne({ _id: placeId }, { title: newTitle, description: newDescription });

    } catch (error) {
        return next(new HttpError('Fetching places failed, please try again later.', 500));
    };

    if (!updatedPlace) {
        return next(new HttpError('Could not find a place for the provided id.', 404));
    };

    res.status(200).json({ place: place.toObject({ getters: true }), message: `Place with id ${place.id} has been updated successfully` });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');

    } catch (error) {
        return next(new HttpError('Fetching places failed, please try again later.', 500));
    };
    if (!userWithPlaces || userWithPlaces.places.length === 0) {
        return next(
            new HttpError('Could not find a places for user with the provided id.', 404)
        );
    }
    res.status(200).json({ places: userWithPlaces.places.map(place => place.toObject({ getters: true })) });
};

const createPlace = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    };

    const { title, description, address } = req.body;

    let coordinates;
    try {
        coordinates = await getCoordsForAddress(address);
    } catch (error) {
        return next(error);
    };

    const createdPlace = new Place(
        {
            title,
            description,
            address,
            location: coordinates,
            image: req.file.path,
            creator: req.userData.userId
        });

    let user;

    try {
        user = await User.findById(
            req.userData.userId
        )
    } catch (error) {
        const err = res.status(500).json('Fetching user failed, please try again');
        return next(err);
    };

    if (!user) {
        const err = res.status(404).json('User with provided id don`t exist')
        return next(err);
    };

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdPlace.save({ session: sess });
        user.places.push(createdPlace);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again.', 500);
        return next(error);
    }
    res.status(201).json({ place: createdPlace });
};

const deletePlacesById = async (req, res, next) => {

    const placeId = req.params.pid;
    let place;

    try {
        place = await Place.findById(placeId).populate('creator');
    } catch (error) {
        const err = res.status(500).json('Fetching place failed, please try again');
        return next(err);
    };

    if (place.creator.id !== req.userData.userId) {
        const error = new HttpError(
            'You are not allowed to delete this place.', 401
        );
        return next(error);
    };

    if (!place) {
        const err = res.status(404).json('Place with provided id don`t exist')
        return next(err);
    };

    const imagePath = place.image;
    try {
        const sess = await mongoose.startSession();
        console.log(sess);
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (error) {
        return next(new HttpError('Deleting places failed, please try again later.', 500))
    };

    fs.unlink(imagePath, (error) => {
        console.log(error);
    })
    res.status(200).json({ message: 'Deleted place.' });
};


exports.getAllPlaces = getAllPlaces;
exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlacesById = deletePlacesById;
exports.updatePlacesById = updatePlacesById;
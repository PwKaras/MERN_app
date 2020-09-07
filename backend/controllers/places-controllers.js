// const uuid = require('uuid/v4');
// const { v4: uuid } = require('uuid');


const { validationResult } = require(`express-validator`);

const HttpError = require('../models/http-error');

const getCoordsForAddress = require('../util/location');
const Place = require('../models/place');
const User = require('../models/user');
const mongooseUniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');


// let DEF_PLACES = [
//     {
//         id: 'p1',
//         title: 'Ellery Creek Big Hole',
//         description: 'The best place in Outback',
//         // imageUrl: 'https://i0.wp.com/www.erldundaroadhouse.com/dsrtks-content/uploads/2016/04/Ellery-Creek-Big-Hole.jpg?ssl=1',
//         address: 'Namatjira NT 0872, Australia',
//         location: {
//             lat: -23.7771692,
//             lng: 133.0735555
//         },
//         creator: 'u1'
//     },
//     {
//         id: 'p2',
//         title: 'Ellery Creek Big Hole_2',
//         description: 'The best place in Outback',
//         // imageUrl: 'https://picsum.photos/200',
//         address: 'Namatjira NT 0872, Australia',
//         location: {
//             lat: 40.7484405,
//             lng: -73.9878584
//         },
//         creator: 'u2'
//     },
//     {
//         id: 'p3',
//         title: 'Sydney',
//         description: 'Down Under biggest city',
//         // imageUrl: 'https://picsum.photos/200',
//         address: 'Sydney, Australia',
//         location: {
//             lat: -23.7771692,
//             lng: 133.0735555
//         },
//         creator: 'u1'
//     },
// ]

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

    //change Mongoose object data to JS.object and remove uderscore_ before id
    res.status(200).json({ place: place.toObject({ getters: true }) });
};

const updatePlacesById = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() })
        // throw new HttpError(
        //     'invalid data', 422)
    };
    const { newTitle, newDescription } = req.body;
    const placeId = req.params.pid;

    let updatedPlace;
    try {
        updatedPlace = await Place.updateOne({ _id: placeId }, { title: newTitle, description: newDescription });

    } catch (error) {
        return next(new HttpError('Fetching places failed, please try again later.', 500));
    };
    // copy of object to change - thanks to spread operator
    // const updatedPlace = {
    //     ...DEF_PLACES.find(p => p.id === placeId
    //     )
    // };
    // const placeIndex = DEF_PLACES.indexOf(updatedPlace);
    // const placeIndex = DEF_PLACES.findIndex(p => p.id === placeId);
    // changes on the copy, to avoid failing existing data
    // updatedPlace.title = newTitle;
    // updatedPlace.description = newDescription;
    //assing succesfully changed data in copy, to existing object
    // DEF_PLACES[placeIndex] = updatedPlace;

    let place;
    try {
        place = await Place.findById(placeId);
    } catch (error) {
        return next(new HttpError('Fetching places failed, please try again later.', 500));
    }

    if (!updatedPlace) {
        return next(new HttpError('Could not find a place for the provided id.', 404));
    };

    res.status(200).json({ place: place.toObject({ getters: true }), message: `Place with id ${place.id} has been updated successfully` });
};

const getPlacesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    // let places;
    // const places = DEF_PLACES.filter(p => {
    //     return p.creator === userId
    // });
    let userWithPlaces;
    try {
        userWithPlaces = await User.findById(userId).populate('places');
        // places = await Place.find({ creator: userId });

    } catch (error) {
        return next(new HttpError('Fetching places failed, please try again later.', 500));
    };
    // if (!places || places.length === 0) {
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
            // res.status(422).json({ errors: errors.array() })
        );
    };

    const { title, description, address, creator } = req.body;

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
            image: 'https://picsum.photos/200',
            creator
        });

    let user;

    try {
        user = await User.findById({ _id: creator })
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
        //creating unique Id 
        await createdPlace.save({ session: sess });
        //push not js, but mongoose - creating contection between two model and add only place id to user.places
        user.places.push(createdPlace);
        //save user only when is part of this current session
        await user.save({ session: sess });
        //in this places -commit changes are save only when all are successfull
        await sess.commitTransaction();
        //IMPORTANT - in MONGODB ATLAS - if don't exist collection - creating manually "+" 
    } catch (err) {
        const error = new HttpError('Creating place failed, please try again.', 500);
        // necessary to add this(return next()) to stop execute code in case error
        return next(error);
    }
    // DEF_PLACES.push(createdPlace);
    res.status(201).json({ place: createdPlace });
};

const deletePlacesById = async (req, res, next) => {
    //shorter way
    // const placeId = req.params.pid;
    // DEF_PLACES = DEF_PLACES.filter(p => { return p.id !== placeId });
    // res.status(200).json({ message: 'Place has been deleted' });

    const placeId = req.params.pid;
    // const place = DEF_PLACES.find(p => {
    //     return p.id === placeId
    // });
    let place;

    try {
        place = await Place.findById(placeId).populate('creator');
        console.log(place);
    } catch (error) {
        const err = res.status(500).json('Fetching place failed, please try again');
        return next(err);
    };

    if (!place) {
        const err = res.status(404).json('Place with provided id don`t exist')
        return next(err);
    };


    try {
        const sess = await mongoose.startSession();
        console.log(sess);
        sess.startTransaction();
        await place.deleteOne({ session: sess });
        // pull - mongoose not js, automaticly remove id 
        place.creator.places.pull(place);
        await place.creator.save({ session: sess });
        await sess.commitTransaction();
    } catch (error) {
        return next(new HttpError('Deleting places failed, please try again later.', 500))
    };

    // const index = DEF_PLACES.indexOf(place);
    // DEF_PLACES.splice(index, 1);
    // res.status(200).json({ message: 'Deleted place.' });
    res.status(200).json({ place: place.toObject({ getters: true }), message: `Place with Id: ${placeId} has been deleted` });
};


exports.getAllPlaces = getAllPlaces;
exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlacesById = deletePlacesById;
exports.updatePlacesById = updatePlacesById;
// const uuid = require('uuid/v4');
const { v4: uuid } = require('uuid');

const { validationResult } = require(`express-validator`);

const HttpError = require('../models/http-error');

const getCoordsForAddress = require('../util/location');

let DEF_PLACES = [
    {
        id: 'p1',
        title: 'Ellery Creek Big Hole',
        description: 'The best place in Outback',
        // imageUrl: 'https://i0.wp.com/www.erldundaroadhouse.com/dsrtks-content/uploads/2016/04/Ellery-Creek-Big-Hole.jpg?ssl=1',
        address: 'Namatjira NT 0872, Australia',
        location: {
            lat: -23.7771692,
            lng: 133.0735555
        },
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Ellery Creek Big Hole_2',
        description: 'The best place in Outback',
        // imageUrl: 'https://picsum.photos/200',
        address: 'Namatjira NT 0872, Australia',
        location: {
            lat: 40.7484405,
            lng: -73.9878584
        },
        creator: 'u2'
    },
    {
        id: 'p3',
        title: 'Sydney',
        description: 'Down Under biggest city',
        // imageUrl: 'https://picsum.photos/200',
        address: 'Sydney, Australia',
        location: {
            lat: -23.7771692,
            lng: 133.0735555
        },
        creator: 'u1'
    },
]

const getAllPlaces = (req, res, next) => {
    res.status(200).json({ places: DEF_PLACES });
};

const getPlacesById = (req, res, next) => {
    const placeId = req.params.pid;
    const place = DEF_PLACES.find(p => {
        return p.id === placeId
    });

    if (!place) {
        throw new HttpError('Could not find a place for the provided id.', 404);

        // return res.status(404).json({ message: 'Could not find a place for the provided id.' })
    };
    res.json({ place: place });
};
const updatePlacesById = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() })
        // throw new HttpError(
        //     'invalid data', 422)
    };
    const { newTitle, newDescription } = req.body;
    const placeId = req.params.pid;

    // copy of object to change - thanks to spread operator
    const updatedPlace = {
        ...DEF_PLACES.find(p => p.id === placeId
        )
    };
    const placeIndex = DEF_PLACES.indexOf(updatedPlace);
    // const placeIndex = DEF_PLACES.findIndex(p => p.id === placeId);
    // changes on the copy, to avoid failing existing data
    updatedPlace.title = newTitle;
    updatedPlace.description = newDescription;

    //assing succesfully changed data in copy, to existing object
    DEF_PLACES[placeIndex] = updatedPlace;


    if (!updatedPlace) {
        throw new HttpError('Could not find a place for the provided id.', 404);
        // return res.status(404).json({ message: 'Could not find a place for the provided id.' })
    };

    res.status(200).json({ place: updatedPlace, message: `Place with Id: ${updatedPlace.id} has been updated` });
};


const deletePlacesById = (req, res, next) => {
    //shorter way
    // const placeId = req.params.pid;
    // DEF_PLACES = DEF_PLACES.filter(p => { return p.id !== placeId });
    // res.status(200).json({ message: 'Place has been deleted' });

    const placeId = req.params.pid;
    const place = DEF_PLACES.find(p => {
        return p.id === placeId
    });

    if (!place) {
        throw new HttpError('Could not find a place for the provided id.', 404);
        // return res.status(404).json({ message: 'Could not find a place for the provided id.' })
    };

    const index = DEF_PLACES.indexOf(place);
    DEF_PLACES.splice(index, 1);
    res.status(200).json({ message: `Place with Id: ${place.id} has been deleted` });
};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const places = DEF_PLACES.filter(p => {
        return p.creator === userId
    });

    if (!places || places.length === 0) {
        return next(
            new HttpError('Could not find a places for user with the provided id.', 404)
        );
        // return res.status(404).json({ message: 'Could not find a places for user with the provided id.' })
    } else {
        res.json({ places });
    };
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

    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coordinates,
        address,
        creator
    };

    DEF_PLACES.push(createdPlace);
    res.status(201).json({ place: createdPlace });
}

exports.getAllPlaces = getAllPlaces;
exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlacesById = deletePlacesById;
exports.updatePlacesById = updatePlacesById;
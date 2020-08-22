// const uuid = require('uuid/v4');
const { v4: uuid } = require('uuid');

const HttpError = require('../models/http-error');

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
    }
]

const getAllPlaces = (req, res, next) => {

}

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
    const { newTitle, newDescription } = req.body;
    const placeId = req.params.pid;

    // copy of object to change - thanks to spred operator
    const updatedPlace = {
        ...DEF_PLACES.find(p => p.id === placeId
        )
    };
    const placeIndex = DEF_PLACES.indexOf(updatedPlace);
    // const placeIndex = DEF_PLACES.findIndex(p => p.id === placeId);
    // changes on the copy, to avoid failing existing data
    updatedPlace.title = newTitle;
    updatedPlace.description = newDescription;

    //asing succesfully changed data in copy, to existing object
    DEF_PLACES[placeIndex] = updatedPlace;


    if (!updatedPlace) {
        throw new HttpError('Could not find a place for the provided id.', 404);
        // return res.status(404).json({ message: 'Could not find a place for the provided id.' })
    };

    res.status(200).json({ place: updatedPlace, message: `Place with Id: ${updatedPlace.id} has been updated`});
};


const deletePlacesById = (req, res, next) => {
    //shorter way
    // const placeId = req.params.pid;
    // DEF_PLACES = DEF_PLACES.filter(p => p.id !== placeId);

    const placeId = req.params.pid;
    const place = DEF_PLACES.find(p => {
        return p.id === placeId
    });

    if (!place) {
        throw new HttpError('Could not find a place for the provided id.', 404);
        // return res.status(404).json({ message: 'Could not find a place for the provided id.' })
    };

    const index = DEF_PLACES.indexOf(place);
    const a = DEF_PLACES.splice(index, [0])
    res.status(200).json({ message: `Place with Id: ${place.id} has been deleted` });


};

const getPlacesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const place = DEF_PLACES.find(p => {
        return p.creator === userId
    });

    if (!place) {
        return next(
            new HttpError('Could not find a places for user with the provided id.', 404)
        );
        // return res.status(404).json({ message: 'Could not find a places for user with the provided id.' })
    } else {
        res.json({ p: place });
    };
};


const createPlace = (req, res, next) => {
    const { title, description, coorditnates, address, creator } = req.body;
    const createdPlace = {
        id: uuid(),
        title,
        description,
        location: coorditnates,
        address,
        creator
    };

    DEF_PLACES.push(createdPlace);
    res.status(201).json({ place: createdPlace });
}

exports.getPlacesById = getPlacesById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.deletePlacesById = deletePlacesById;
exports.updatePlacesById = updatePlacesById;
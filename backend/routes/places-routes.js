const express = require('express');

const HttpError = require('../models/http-error');

const router = express.Router();

const DEF_PLACES = [
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

router.get('/:pid', (req, res, next) => {
    const placeId = req.params.pid;
    const place = DEF_PLACES.find(p => {
        return p.id === placeId
    });

    if (!place) {
        throw new HttpError('Could not find a place for the provided id.', 404);

        // return res.status(404).json({ message: 'Could not find a place for the provided id.' })
    };
    res.json({ place: place });

});

router.get('/user/:uid', (req, res, next) => {
    const userId = req.params.uid;
    const place = DEF_PLACES.find(p => {
        return p.creator === userId
    });

    if (!place) {
        return next(
            new Error('Could not find a places for user with the provided id.', 404)
        );
        // return res.status(404).json({ message: 'Could not find a places for user with the provided id.' })
    } else {
        res.json({ p: place });
    };
});

module.exports = router;
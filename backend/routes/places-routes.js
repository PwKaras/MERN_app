const express = require('express');

const { check, body } = require('express-validator');

const placesControllers = require('../controllers/places-controllers');

const fileUpload = require('../middelweare/file-upload');
const checkAuth = require('../middelweare/check-auth');

const router = express.Router();

router.get('/', placesControllers.getAllPlaces);

router.get('/:pid', placesControllers.getPlacesById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.use(checkAuth);

router.delete('/:pid', placesControllers.deletePlacesById);

router.patch('/:pid',
[
    body('newTitle')
    .not()
    .isEmpty(),
    body('newDescription')
    .isLength({ min: 3 })
],
placesControllers.updatePlacesById);


router.post(
    '/',
    fileUpload.single('image'),
    [check('title')
        .not()
        .isEmpty().
        withMessage('Must be not empty'),
    check('description')
        .isLength({ min: 5 }).withMessage('Must contain at least 5 characters'),
    check('address')
        .not()
        .isEmpty()
        .withMessage('Must be not empty')
    ],
    placesControllers.createPlace);

module.exports = router;
const express = require('express');

const placesControllers = require('../controllers/places-controllers');

const router = express.Router();

router.get('/:pid', placesControllers.getPlacesById);

router.delete('/:pid', placesControllers.deletePlacesById);

router.patch('/:pid', placesControllers.updatePlacesById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

router.post('/', placesControllers.createPlace);



module.exports = router;
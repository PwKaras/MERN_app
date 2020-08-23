const express = require('express');

const { check } = require('express-validator');

const usersControlers = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersControlers.getUsers);

router.post('/singup',
    [
        check('name')
            .not()
            .isEmpty()
            .withMessage('Must be not empty'),
        check('email')
            .normalizeEmail()
            .isEmail()
            .withMessage('Pease enter valid e-mail.'),
        check('password')
            .isLength({ min: 8 })
            .withMessage('Must contain at least 8 characters')
            .matches(/\d/).withMessage('must contain a number')
    ], usersControlers.singup);

router.post('/login', usersControlers.login);

module.exports = router;
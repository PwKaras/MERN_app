const User = require('../models/user');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

const getUsers = async (req, res, next) => {
    let users;

    try {
        users = await User.find({}, '-password');
    } catch (error) {
        const err = res.status(500).json({ message: 'Could not get users, please try again leater.' });
        return next(err);
    }

    if (!users || users.length === 0) {
        return next(
            new HttpError('No users found', 404));
    }
    res.status(200).json({ allUsers: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    };

    const { name, email, password } = req.body;

    let repetedEmail;
    try {
        repetedEmail = await User.findOne({ email: email });
    } catch (error) {
        return next(new HttpError('Signig up failed, please try again later', 500));
    };

    if (repetedEmail) {
        return next(
            new HttpError('User with this email already exist, please login', 422)
        )
    };

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);

    } catch (err) {
        const error = new HttpError('Could not create user, please try again.', 500
        );
        return next(error);
    }

    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        places: []
    });

    try {
        await createdUser.save();
    } catch (error) {
        return next(new HttpError('Creating new user failed, please try again later', 500));
    };

    let token;
    try {
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, process.env.JWT_KEY, { expiresIn: '1h' });
    } catch (error) {
        const err = new HttpError('Signing up failed, please try again later.', 500)
    };

    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token, message: `Welcome ${name}` });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let loggedUser;
    try {
        loggedUser = await User.findOne({ email: email })

    } catch (error) {
        return next(new HttpError('Loggin failed, please try again later', 500))

    };

    if (!loggedUser) {
        return next(
            new HttpError('User email or password are not correct or not exist, credential seems to be wrong.', 403));
    };

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, loggedUser.password);
    } catch (err) {
        return next(
            new HttpError('Could not log you in, please check your credentials and try again.', 500)
        )
    };

    if (!isValidPassword) {
        const error = new HttpError('User email or password are not correct or not exist, crudential seems to be wrong.', 403)
    }

    let token;
    try {
        token = jwt.sign(
            { userId: loggedUser.id, email: loggedUser.email }, process.env.JWT_KEY,
            { expiresIn: '1h' });
    } catch (error) {
        const err = new HttpError('Signing up failed, please try again later.', 500)
    };

    res.json({
        userId: loggedUser.id,
        email: loggedUser.email,
        token: token
    });

};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
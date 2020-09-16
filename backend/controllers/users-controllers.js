// const { v4: uuid } = require('uuid');
const User = require('../models/user');

const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

// const USERS = [
//     {
//         id: 'u1',
//         name: 'Pawel',
//         image: 'https://picsum.photos/200',
//         email: 'admin@admin.com',
//         password: 'admin123',
//         placeCount: 3
//     },
//     {
//         id: 'u2',
//         name: 'John',
//         image: 'https://picsum.photos/200',
//         email: 'john@test.com',
//         password: 'john1234',
//         placeCount: 2
//     }
// ];

// const defaultImage = 'https://picsum.photos/200';

const getUsers = async (req, res, next) => {
    let users;

    try {
        // insted exclude (minus) email '-email', could indicate what exact get i.e. 'name image'
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
    // const { name, email, password, img } = req.body;

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
        //12 optimum - hard do hack, short time to generate
        hashedPassword = await bcrypt.hash(password, 12);

    } catch (err) {
        const error = new HttpError('Could not create user, please try again.', 500
        );
        return next(error);
    }

    const createdUser = new User({
        // id: uuid(),
        name,
        email,
        password: hashedPassword,
        image: req.file.path,
        // when do like below, after changing port or host - problem - exact path is saved in dataBase(5051)
        // image: `http://localhost:5051/${req.file.path}`,
        // image: img || defaultImage,
        places: []
    });

    try {
        await createdUser.save();
    } catch (error) {
        return next(new HttpError('Creating new user failed, please try again later', 500));
    };

    let token;
    try {
        // first argument - payload - data to encode in token
        // second string - supers secret code, only to know of server
        // third- token configuration IMPORTANT - lmit expiration as safty rule
        token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, 'funy_desert_meal', { expiresIn: '1h' });
    } catch (error) {
        const err = new HttpError('Signing up failed, please try again later.', 500)
    };

    // USERS.push(createdUser);
    // not send back all data, extract only this necessary in front
    res.status(201).json({ userId: createdUser.id, email: createdUser.email, token: token, message: `Welcome ${name}` });
    // res.status(201).json({ user: createdUser.toObject({ getters: true }), message: `Welcome ${name}` });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    let loggedUser;
    try {
        loggedUser = await User.findOne({ email: email })

    } catch (error) {
        return next(new HttpError('Loggin failed, please try again later', 500))

    };
    // const loggedUser = USERS.find(u => {
    //     return u.email === email && u.password === password
    // });

    if (!loggedUser) {
        return next(
            new HttpError('User email or password are not correct or not exist, credential seems to be wrong.', 403));
    };

    let isValidPassword = false;
    try {
        //  compare password extracted from req.body and existing users (with this email) password
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
            { userId: loggedUser.id, email: loggedUser.email }, 'funy_desert_meal',
            { expiresIn: '1h' });
    } catch (error) {
        const err = new HttpError('Signing up failed, please try again later.', 500)
    };

    // res.json({ message: 'Logged in' }) 
    res.json({
        userId: loggedUser.id,
        email: loggedUser.email,
        token: token
    });
    // res.status(200).json({ message: `Welcom ${loggedUser.name}`, user: loggedUser.toObject({ getters: true }) });

};

// router.get('/:uid', (req, res, next) => {
//     const userId = req.params.uid;
//     const user = USERS.find(u => {
//         return u.id === userId
//     });
//     res.json({user: user});
// });

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
// const { v4: uuid } = require('uuid');
const User = require('../models/user');

const { validationResult } = require('express-validator');

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

const defaultImage = 'https://picsum.photos/200';

const getUsers = async (req, res, next) => {
    let users;

    try {
        // insted exclude (minus) email '-email', could indicate what exact get i.e. 'name image'
        users = await User.find({}, '-email');
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

    const { name, email, password, img } = req.body;

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

    const createdUser = new User({
        // id: uuid(),
        name,
        email,
        password,
        image: img || defaultImage,
        places: []
    });

    try {
        await createdUser.save();
    } catch (error) {
        return next(new HttpError('Creating new user failed, please try again later', 500));
    };

    // USERS.push(createdUser);
    res.status(201).json({ user: createdUser.toObject({ getters: true }), message: `Welcome ${name}` });
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

    if (!loggedUser || loggedUser.password !== password) {
        return next(
            new HttpError('User email or password are not correct or not exist, crudential seems to be wrong.', 401));
    };
    // res.json({ message: 'Logged in' })
    res.status(200).json({ message: `Welcom ${loggedUser.name}`, user: loggedUser.toObject({ getters: true }) });

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
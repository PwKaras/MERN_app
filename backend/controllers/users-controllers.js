const { v4: uuid } = require('uuid');

const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');

const USERS = [
    {
        id: 'u1',
        name: 'Pawel',
        image: 'https://picsum.photos/200',
        email: 'admin@admin.com',
        password: 'admin123',
        placeCount: 3
    },
    {
        id: 'u2',
        name: 'John',
        image: 'https://picsum.photos/200',
        email: 'john@test.com',
        password: 'john1234',
        placeCount: 2
    }
];

const defaultImage = 'https://picsum.photos/200';

const getUsers = (req, res, next) => {
    const users = USERS;

    if (!users || users.length === 0) {
        throw new HttpError('No users found', 404)
    }
    res.json({ allUsers: users });
};

const singup = (req, res, next) => {
    const { name, email, password, img } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json(errors.array());
    };

    const repetedEmail = USERS.find(u => { return u.email === email });
    if (repetedEmail) {
        throw new HttpError('User with this email already exist, please login', 422)
    };

    const createdUser = {
        id: uuid(),
        name,
        email,
        password,
        image: img || defaultImage,
    };

    USERS.push(createdUser);
    res.status(201).json({ message: `Welcome ${name}` });
};

const login = (req, res, next) => {
    const { email, password } = req.body;

    const loggedUser = USERS.find(u => {
        return u.email === email && u.password === password
    });

    if (!loggedUser) {
        throw new HttpError('User email or password are not correct or not exist, crudential seems to be wrong', 401);
    };

    res.status(200).json({ message: `Welcom ${loggedUser.name}` });

};

// router.get('/:uid', (req, res, next) => {
//     const userId = req.params.uid;
//     const user = USERS.find(u => {
//         return u.id === userId
//     });
//     res.json({user: user});
// });

exports.getUsers = getUsers;
exports.singup = singup;
exports.login = login;
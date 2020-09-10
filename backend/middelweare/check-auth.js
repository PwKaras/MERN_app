const jwt = require('jsonwebtoken');

const HttpError = require("../models/http-error");

module.exports = (req, res, next) => {
    // allows browsers to pre request 'OPTIONS' method
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        // allows for this headers - authorization in front - server.js Access-Control-Allow-Headers
        const token = req.headers.authorization.split(' ')[1]; //Authorization: 'Bearer TOKEN' - split this by white space and access to second part[1]
        if (!token) {
            throw new Error('Authentication failed!');
        }
        // return payload so in this case userId and email
        const decodedToken = jwt.verify(token, 'funy_desert_meal');
        // add data to req 
        req.userData = { userId: decodedToken.userId };
        //after have veryfy token - next() (whitout return) don`t stop req and allows to req go to the next routes - access for veryfied users  
        next();
    } catch (error) {
        const err = new HttpError('Authentication failed!', 403);
        return next(err);
    }
};
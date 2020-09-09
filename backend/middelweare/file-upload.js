const multer = require('multer');
const {v1: uuidv1} = require('uuid');

// specify right extension
const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',

}

const fileUpload = multer({
    // limit in bytes 500 kb
    limits: 500000,
    //how data should sotrage
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            //error or null and path where store files (folders path)
            cb(null, 'uploads/images');

        },
        filename: (req, file, cb) => {
            //dynamicly access to property of MIME_TYPE_MAP
            const ext = MIME_TYPE_MAP[file.mimetype]
            //as callBack cb two arguments error or null as first
            // second file name with unique id and corect extension
            cb(null, uuidv1() + '.' + ext);
        }
    }),
    fileFilter: (req, file, cb) => {
        // can find mimetype = isValid
        //!! convert undefined or null to false; if exist to true
        const isValid = !!MIME_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error(`Invalid mimie type!`);
        //second argument always boolean

        cb(error, isValid);
    }
});

module.exports = fileUpload;
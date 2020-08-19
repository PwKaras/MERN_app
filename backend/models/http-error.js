class HttpError extends Error {
    constructor(message, errorCode) {
        super(message); //Add a "message" property form Error
        this.code = errorCode //Add a "code" property from this

    }
};

module.exports = HttpError
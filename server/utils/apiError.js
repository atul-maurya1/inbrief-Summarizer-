class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        data = null
    ) {
        super(message);

        this.statusCode = statusCode || 400;
        this.errors = errors;
        this.data = data;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
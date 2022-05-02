export default class CustomError {
    constructor(status = 500, message = "", error = "") {
        this.error = {
            status,
            message,
            error
        };
    }

    setError(status, message, error) {
        this.error.status = status;
        this.error.message = message;
        this.error.error = error;
    }

    getError() {
        return this.error;
    }
}

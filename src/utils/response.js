class Response {
    constructor({ code, data, error, detail }) {
        this.code = code;
        this.data = data || null;
        this.error = error || null;
        this.detail = detail || null;

        if (code >= 400) {
            this.status = "Error";
        } else {
            this.status = "Success";
        }
    }

    send() {
        if (this.isSuccess()) {
            return {
                statusCode: this.code,
                status: this.status,
                data: this.data,
                error: null,
            };
        } else {
            return {
                statusCode: this.code,
                status: this.status,
                data: null,
                error: {
                    message: this.error,
                    detail: this.detail,
                },
            };
        }
    }

    isSuccess() {
        return this.status == "Success";
    }
}

module.exports = { Response };

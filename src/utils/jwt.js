const jwt = require("jsonwebtoken");

class JWT {
    #secret;
    constructor() {
        this.#secret = process.env.JWT_SECRET || "my-secret-jwt";
    }

    generate(payload) {
        return jwt.sign(payload, this.#secret);
    }

    verify(token) {
        try {
            return jwt.verify(token, this.#secret);
        } catch (error) {
            throw "Invalid Token";
        }
    }
}

module.exports = { JWT };

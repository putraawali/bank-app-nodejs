const express = require("express");

class UserRouter {
    userHandler;
    #router;
    constructor({ userHandler }) {
        this.userHandler = userHandler;
        this.#router = express.Router();

        // Register router when instance created
        this.registerRouter();
    }

    registerRouter() {
        this.#router.post("/register", this.userHandler.register);
        this.#router.post("/login", this.userHandler.login);
    }

    getRouter() {
        return this.#router;
    }
}

module.exports = { UserRouter };

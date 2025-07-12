const express = require("express");
const { UserHandler } = require("../handlers/user_handler");

class UserRouter {
    userHandler;
    #router;
    constructor({ usecases }) {
        this.userHandler = new UserHandler({ usecases });
        this.#router = express.Router();

        // Register router when instance created
        this.registerRouter();
    }

    registerRouter() {
        this.#router.post("/register", this.userHandler.register);
        this.#router.post("/login", this.userHandler.login);
        this.#router.get("", this.userHandler.getDetail);
    }

    getRouter() {
        return this.#router;
    }
}

module.exports = { UserRouter };

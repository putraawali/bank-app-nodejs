const express = require("express");
const { AccountHandler } = require("../handlers/account_handler");

class AccountRouter {
    accountHandler;
    #router;
    constructor({ usecases }) {
        this.accountHandler = new AccountHandler({ usecases });
        this.#router = express.Router();

        // Register router when instance created
        this.registerRouter();
    }

    registerRouter() {
        this.#router.post("/deposit", this.accountHandler.deposit);
        this.#router.post("/withdraw", this.accountHandler.withdraw);
        this.#router.post("/transfer", this.accountHandler.transfer);
    }

    getRouter() {
        return this.#router;
    }
}

module.exports = { AccountRouter };

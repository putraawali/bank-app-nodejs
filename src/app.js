const express = require("express");
const { Repository } = require("./repositories");
const { Usecase } = require("./usecases");
const { UserRouter } = require("./router/user_router");

class App {
    #app;
    constructor({ db }) {
        this.registerApp(db);
    }

    registerApp(db) {
        const app = express();
        app.use(express.json());

        const userRouter = new UserRouter({
            usecases: new Usecase({
                repository: new Repository({ db }),
            }),
        });

        app.use("/user", userRouter.getRouter());

        this.#app = app;
    }

    getApp() {
        return this.#app;
    }
}

module.exports = { createApp, App };

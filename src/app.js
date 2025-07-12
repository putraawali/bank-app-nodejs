const express = require("express");
const { Repository } = require("./repositories");
const { Usecase } = require("./usecases");
const { UserRouter } = require("./router/user_router");
const { Middleware } = require("./middlewares/middleware");
const { Response } = require("./utils/response");
const { AccountRouter } = require("./router/account_router");

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

        const accountRouter = new AccountRouter({
            usecases: new Usecase({
                repository: new Repository({ db }),
            }),
        });

        app.use(Middleware.validateXRequestId);
        app.use(Middleware.validateContentType);
        app.use(Middleware.logRequest);
        app.use(Middleware.logResponse);

        app.use("/user", Middleware.authentication, userRouter.getRouter());
        app.use(
            "/account",
            Middleware.authentication,
            accountRouter.getRouter()
        );
        // Error handler
        app.use(Middleware.errorHandler);

        this.#app = app;
    }

    getApp() {
        return this.#app;
    }
}

module.exports = { App };

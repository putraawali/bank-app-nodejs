const express = require("express");
const { Repository } = require("./repositories");
const { Usecase } = require("./usecases");
const { UserRouter } = require("./router/user_router");
const { Middleware } = require("./middlewares/middleware");
const { Response } = require("./utils/response");

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

        app.use("/user", Middleware.authentication, userRouter.getRouter());

        // Error handler
        app.use((err, req, res, next) => {
            if (err instanceof Response) {
                return res.status(err.code).json(err.send());
            }

            const response = new Response({
                code: 500,
                error: "Internal server error",
                detail: err,
            });
            return res.status(response.code).json(response.send());
        });
        this.#app = app;
    }

    getApp() {
        return this.#app;
    }
}

module.exports = { App };

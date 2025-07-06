const express = require("express");
const { Repository } = require("./repositories");
const { User, Account, Transaction } = require("./models");
const { UserUsecase } = require("./usecases/user_usecase");
const { Usecase } = require("./usecases");
const { UserHandler } = require("./handlers/user_handler");
const { UserRouter } = require("./router/user_router");

function createApp({ db }) {
    const app = express();
    app.use(express.json());

    const userRouter = new UserRouter({
        usecases: new Usecase({
            repository: new Repository({ db }),
        }),
    });

    app.use("/user", userRouter.getRouter());

    return { app };
}

module.exports = { createApp };

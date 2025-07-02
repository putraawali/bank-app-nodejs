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

    const models = {
        user: User,
        account: Account,
        transaction: Transaction,
    };

    const repository = new Repository(models);

    const usecases = {
        user: new UserUsecase({ models, db, repository }),
    };

    const usecase = new Usecase(usecases);

    const userRouter = new UserRouter({
        userHandler: new UserHandler(usecase),
    });

    app.use("/user", userRouter.getRouter());

    return { app };
}

module.exports = { createApp };

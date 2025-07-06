const { UserUsecase } = require("./user_usecase");

class Usecase {
    userUsecase;
    accountUsecase;
    transactionUsecase;

    constructor({ repository }) {
        this.userUsecase = new UserUsecase({ repository });
    }
}

module.exports = { Usecase };

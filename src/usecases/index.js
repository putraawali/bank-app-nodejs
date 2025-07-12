const { AccountUsecase } = require("./account_usecase");
const { UserUsecase } = require("./user_usecase");

class Usecase {
    userUsecase;
    accountUsecase;
    transactionUsecase;

    constructor({ repository }) {
        this.userUsecase = new UserUsecase({ repository });
        this.accountUsecase = new AccountUsecase({ repository });
    }
}

module.exports = { Usecase };

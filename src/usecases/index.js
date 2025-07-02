class Usecase {
    userUsecase;
    accountUsecase;
    transactionUsecase;

    constructor(uc) {
        this.userUsecase = uc.user;
    }
}

module.exports = { Usecase };

class AccountHandler {
    usecases;
    constructor({ usecases }) {
        this.usecases = usecases;
    }

    // Using arrow function to automate binding 'this'
    deposit = async (req, res, next) => {
        try {
            let user = req.userData;
            let { amount, pin } = req.body;
            const result = await this.usecases.accountUsecase.deposit({
                user_id: user.user_id,
                amount,
                pin,
            });
            return res.status(result.code).json(result.send());
        } catch (error) {
            next(error);
        }
    };
}

module.exports = { AccountHandler };

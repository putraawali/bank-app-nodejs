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

    // Using arrow function to automate binding 'this'
    withdraw = async (req, res, next) => {
        try {
            let user = req.userData;
            let { amount, pin } = req.body;
            const result = await this.usecases.accountUsecase.withdraw({
                user_id: user.user_id,
                amount,
                pin,
            });
            return res.status(result.code).json(result.send());
        } catch (error) {
            next(error);
        }
    };

    // Using arrow function to automate binding 'this'
    transfer = async (req, res, next) => {
        try {
            let user = req.userData;
            let { amount, pin, recipient_account_number } = req.body;
            const result = await this.usecases.accountUsecase.transfer({
                user_id: user.user_id,
                amount,
                pin,
                recipient_account_number,
            });
            return res.status(result.code).json(result.send());
        } catch (error) {
            next(error);
        }
    };
}

module.exports = { AccountHandler };

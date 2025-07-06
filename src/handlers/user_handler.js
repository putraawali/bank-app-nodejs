class UserHandler {
    usecases;
    constructor({ usecases }) {
        this.usecases = usecases;
    }

    // Using arrow function to automate binding 'this'
    register = async (req, res, next) => {
        try {
            let { email, password, pin } = req.body;
            const result = await this.usecases.userUsecase.register({
                email,
                password,
                pin,
            });
            return res.status(result.code).json(result.send());
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            let { email, password } = req.body;
            const result = await this.usecases.userUsecase.login({
                email,
                password,
            });
            return res.status(200).json({ data: result, code: 200 });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req, res, next) => {
        try {
            let user = req.userData;
            const result = await this.usecases.userUsecase.getDetail(user);
            return res.status(200).json({ message: result, code: 200 });
        } catch (error) {
            next(error);
        }
    };
}

module.exports = { UserHandler };

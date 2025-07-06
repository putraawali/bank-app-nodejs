class UserHandler {
    usecases;
    constructor({ usecases }) {
        this.usecases = usecases;
    }

    // Using arrow function to automate binding 'this'
    register = async (req, res) => {
        try {
            let { email, password, pin } = req.body;
            const result = await this.usecases.userUsecase.register({
                email,
                password,
                pin,
            });
            res.status(201).json({ data: result, code: 201 });
        } catch (err) {
            res.status(500).json({
                error: err,
                code: 500,
            });
        }
    };

    login = async (req, res) => {
        try {
            let { email, password } = req.body;
            const result = await this.usecases.userUsecase.login({
                email,
                password,
            });
            res.status(200).json({ data: result, code: 200 });
        } catch (error) {
            res.status(500).json({
                error: error,
                code: 500,
            });
        }
    };

    getDetail = async (req, res) => {
        try {
            let user = req.userData;
            const result = await this.usecases.userUsecase.getDetail(user);
            res.status(200).json({ message: result, code: 200 });
        } catch (error) {
            res.status(500).json({
                error: error,
                code: 500,
            });
        }
    };
}

module.exports = { UserHandler };

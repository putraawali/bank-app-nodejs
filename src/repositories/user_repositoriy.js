class UserRepository {
    #userModel;
    #transaction;
    constructor(userModel) {
        this.#userModel = userModel;
        this.#transaction = null;
    }

    setTransaction(t) {
        this.#transaction = t;
    }

    async createUser(data) {
        return this.#userModel.create(data, { transaction: this.#transaction });
    }

    async findOne(conditions) {
        let where = {};

        if (conditions.email) {
            where["email"] = conditions.email;
        }

        return this.#userModel.findOne({ where });
    }
}

module.exports = { UserRepository };

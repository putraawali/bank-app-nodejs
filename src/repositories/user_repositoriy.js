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

        if (conditions.user_id) {
            where["user_id"] = conditions.user_id;
        }

        return this.#userModel.findOne({ where });
    }
}

module.exports = { UserRepository };

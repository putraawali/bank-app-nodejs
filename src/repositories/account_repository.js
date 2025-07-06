const crypto = require("crypto");

class AccountRepository {
    #accountModel;
    #transaction;

    constructor(accountModel) {
        this.#accountModel = accountModel;
    }

    setTransaction(t) {
        this.#transaction = t;
    }

    async createAccount(data) {
        return this.#accountModel.create(data, {
            transaction: this.#transaction,
        });
    }

    generateAccountNumber() {
        const uuid = crypto.randomUUID();
        const hash = crypto.createHash("sha256").update(uuid).digest("hex");
        const numberOnly = hash.replace(/\D/g, "");
        return numberOnly.slice(0, 10);
    }

    async findOne(conditions) {
        let where = {};

        if (conditions.user_id) {
            where["user_id"] = conditions.user_id;
        }

        if (conditions.account_number) {
            where["account_number"] = conditions.account_number;
        }

        return this.#accountModel.findOne({ where });
    }
}

module.exports = { AccountRepository };

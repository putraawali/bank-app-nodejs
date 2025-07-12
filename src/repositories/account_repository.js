const crypto = require("crypto");
const { Response } = require("../utils/response");
const Decimal = require("decimal.js");

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

        return this.#accountModel.findOne({
            where,
            transaction: this.#transaction,
            lock: conditions.lock,
        });
    }

    async deposit({ account_id, amount }) {
        if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
            throw new Response({
                code: 400,
                error: "Invalid amount",
                detail: "Deposit amount must be a valid number greater than 0",
            });
        }

        if (!account_id) {
            throw new Response({
                code: 400,
                detail: "Invalid data account id",
                error: "Deposit failed",
            });
        }

        const safeAmount = new Decimal(amount);

        return this.#accountModel.increment(
            { balance: safeAmount.toNumber() },
            { where: { account_id }, transaction: this.#transaction }
        );
    }

    async withdraw({ account_id, amount }) {
        try {
            if (typeof amount !== "number" || isNaN(amount) || amount <= 0) {
                throw new Response({
                    code: 400,
                    error: "Invalid amount",
                    detail: "Deposit amount must be a valid number less than 0",
                });
            }

            if (!account_id) {
                throw new Response({
                    code: 400,
                    detail: "Invalid data account id",
                    error: "Deposit failed",
                });
            }

            const safeAmount = new Decimal(amount).negated();

            await this.#accountModel.increment(
                { balance: safeAmount.toNumber() },
                { where: { account_id }, transaction: this.#transaction }
            );
            return;
        } catch (_) {
            throw new Response({
                code: 400,
                error: "Insufficient Balance",
                detail: "Customer's balance is not enough",
            });
        }
    }
}

module.exports = { AccountRepository };

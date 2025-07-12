const Decimal = require("decimal.js");
const { Repository } = require("../repositories");
const { Bcrypt } = require("../utils/bcrypt");
const { Response } = require("../utils/response");

class AccountUsecase {
    #models;
    #repository;
    #db;

    constructor({ repository }) {
        this.#models = repository.getModel();
        this.#repository = repository;
        this.#db = repository.getDb();
    }

    async deposit({ user_id, pin, amount }) {
        try {
            const repo = new Repository({ db: this.#db });

            await repo.withTransaction(async (repos, tx) => {
                const account = await repos.accountRepository.findOne({
                    user_id: user_id,
                    lock: tx.LOCK.UPDATE,
                });

                if (account === null) {
                    throw new Response({
                        code: 404,
                        error: "Account not found!",
                        detail: "Account not found!",
                    });
                }

                if (!Bcrypt.compare(pin, account.dataValues.pin)) {
                    throw new Response({
                        code: 400,
                        error: "Invalid PIN!",
                        detail: "Invalid PIN!",
                    });
                }

                await repos.accountRepository.deposit({
                    account_id: account.dataValues.account_id,
                    amount,
                });

                await repos.transactionRepository.create({
                    from_account_id: account.dataValues.account_id,
                    to_account_id: account.dataValues.account_id,
                    amount: amount,
                    transaction_type: "deposit",
                });

                return;
            });

            return new Response({ code: 200 });
        } catch (error) {
            throw error;
        }
    }

    async withdraw({ user_id, pin, amount }) {
        try {
            const repo = new Repository({ db: this.#db });

            await repo.withTransaction(async (repos, tx) => {
                const account = await repos.accountRepository.findOne({
                    user_id: user_id,
                    lock: tx.LOCK.UPDATE,
                });

                if (account === null) {
                    throw new Response({
                        code: 404,
                        error: "Account not found!",
                        detail: "Account not found!",
                    });
                }

                if (!Bcrypt.compare(pin, account.dataValues.pin)) {
                    throw new Response({
                        code: 400,
                        error: "Invalid PIN!",
                        detail: "Invalid PIN!",
                    });
                }

                await repos.accountRepository.withdraw({
                    account_id: account.dataValues.account_id,
                    amount,
                });

                await repos.transactionRepository.create({
                    from_account_id: account.dataValues.account_id,
                    to_account_id: account.dataValues.account_id,
                    amount: amount,
                    transaction_type: "withdraw",
                });

                return;
            });

            return new Response({ code: 200 });
        } catch (error) {
            throw error;
        }
    }

    async transfer({ user_id, pin, amount, recipient_account_number }) {
        try {
            const repo = new Repository({ db: this.#db });

            await repo.withTransaction(async (repos, tx) => {
                const sourceAccount = await repos.accountRepository.findOne({
                    user_id: user_id,
                    lock: tx.LOCK.UPDATE,
                });

                if (sourceAccount === null) {
                    throw new Response({
                        code: 404,
                        error: "Account not found!",
                        detail: "Account not found!",
                    });
                }

                if (!Bcrypt.compare(pin, sourceAccount.dataValues.pin)) {
                    throw new Response({
                        code: 400,
                        error: "Invalid PIN!",
                        detail: "Invalid PIN!",
                    });
                }

                if (
                    sourceAccount.dataValues.account_number ==
                    recipient_account_number
                ) {
                    throw new Response({
                        code: 400,
                        error: "Invalid Recipient",
                        detail: "Cannot transfer to the same account.",
                    });
                }

                const customerBalance = new Decimal(
                    sourceAccount.dataValues.balance
                ).toNumber();
                if (customerBalance < amount) {
                    throw new Response({
                        code: 400,
                        error: "Insufficient Balance",
                        detail: "Customer balance less than transfered amount",
                    });
                }

                const recipientAccount = await repos.accountRepository.findOne({
                    account_number: recipient_account_number,
                    lock: tx.LOCK.UPDATE,
                });

                if (recipientAccount === null) {
                    throw new Response({
                        code: 404,
                        error: "Recipient Account not found!",
                        detail: "Recipient Account not found!",
                    });
                }

                await Promise.all([
                    repos.accountRepository.withdraw({
                        account_id: sourceAccount.dataValues.account_id,
                        amount,
                    }),
                    repos.accountRepository.deposit({
                        account_id: recipientAccount.dataValues.account_id,
                        amount: amount,
                    }),
                    repos.transactionRepository.create({
                        from_account_id: sourceAccount.dataValues.account_id,
                        to_account_id: recipientAccount.dataValues.account_id,
                        amount: amount,
                        transaction_type: "transfer",
                    }),
                ]);

                return;
            });

            return new Response({
                code: 200,
                data: {
                    message: "Transfer successfull",
                    amount,
                    to: recipient_account_number,
                },
            });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = { AccountUsecase };

const Decimal = require("decimal.js");
const { Repository } = require("../repositories");
const { Bcrypt } = require("../utils/bcrypt");
const { JWT } = require("../utils/jwt");
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

    // async register(data) {
    //     try {
    //         const foundUser = await this.#repository.userRepository.findOne({
    //             email: data.email,
    //         });
    //         if (foundUser !== null) {
    //             throw new Response({
    //                 code: 400,
    //                 error: "Email already exists",
    //                 detail: "Email " + data.email + " already registered",
    //             });
    //         }

    //         const repo = new Repository({ db: this.#db });
    //         await repo.withTransaction(async (repos) => {
    //             const user = await repos.userRepository.createUser({
    //                 email: data.email,
    //                 password: data.password,
    //             });

    //             let accountNumber;
    //             let isUnique = false;
    //             let counter = 0;

    //             while (!isUnique) {
    //                 accountNumber =
    //                     repos.accountRepository.generateAccountNumber();

    //                 const exist =
    //                     await this.#repository.accountRepository.findOne({
    //                         account_number: accountNumber,
    //                     });

    //                 if (!exist) {
    //                     isUnique = true;
    //                 } else {
    //                     counter++;
    //                     if (counter === 5) {
    //                         throw new Response({
    //                             code: 500,
    //                             error: "Unable to generate account number",
    //                             detail: "Unable to generate account number",
    //                         });
    //                     }
    //                 }
    //             }

    //             await repos.accountRepository.createAccount({
    //                 user_id: user.dataValues.user_id,
    //                 account_number: accountNumber,
    //                 pin: data.pin,
    //             });

    //             return;
    //         });

    //         return new Response({ code: 201 });
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async login(data) {
    //     try {
    //         const user = await this.#repository.userRepository.findOne({
    //             email: data.email,
    //         });

    //         if (!user) {
    //             throw new Response({
    //                 code: 400,
    //                 error: "Email not found",
    //                 detail: "User with email " + data.email + " not found",
    //             });
    //         }

    //         if (!Bcrypt.compare(data.password, user.dataValues.password)) {
    //             throw new Response({
    //                 code: 400,
    //                 error: "Ivalid password",
    //                 detail: "Wrong password",
    //             });
    //         }

    //         const jwt = new JWT();
    //         return new Response({
    //             code: 200,
    //             data: {
    //                 access_token: jwt.generate({
    //                     user_id: +user.dataValues.user_id,
    //                     email: user.dataValues.email,
    //                 }),
    //             },
    //         });
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    // async getDetail(data) {
    //     try {
    //         let user = await this.#repository.userRepository.findOne({
    //             email: data.email,
    //         });

    //         if (!user) {
    //             throw new Response({
    //                 code: 404,
    //                 error: "Invalid user",
    //                 detail: "User not found",
    //             });
    //         }

    //         let account = await this.#repository.accountRepository.findOne({
    //             user_id: data.user_id,
    //         });

    //         if (!account) {
    //             throw new Response({
    //                 code: 404,
    //                 error: "No account found",
    //                 detail: "No account found",
    //             });
    //         }

    //         return new Response({
    //             code: 200,
    //             data: {
    //                 email: data.email,
    //                 balance: new Decimal(account.dataValues.balance),
    //             },
    //         });
    //     } catch (error) {
    //         throw error;
    //     }
    // }
}

module.exports = { AccountUsecase };

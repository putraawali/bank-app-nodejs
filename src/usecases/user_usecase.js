const Decimal = require("decimal.js");
const { Repository } = require("../repositories");
const { Bcrypt } = require("../utils/bcrypt");
const { JWT } = require("../utils/jwt");

class UserUsecase {
    #models;
    #repository;
    #db;

    constructor({ repository }) {
        this.#models = repository.getModel();
        this.#repository = repository;
        this.#db = repository.getDb();
    }

    async register(data) {
        try {
            const repo = new Repository({ db: this.#db });
            const result = await repo.withTransaction(async (repos) => {
                const user = await repos.userRepository.createUser({
                    email: data.email,
                    password: data.password,
                });

                let accountNumber;
                let isUnique = false;

                while (!isUnique) {
                    accountNumber =
                        repos.accountRepository.generateAccountNumber();

                    const exist =
                        await this.#repository.accountRepository.findOne({
                            account_number: accountNumber,
                        });

                    if (!exist) {
                        isUnique = true;
                    }
                }

                await repos.accountRepository.createAccount({
                    user_id: user.dataValues.user_id,
                    account_number: accountNumber,
                    pin: data.pin,
                });

                const result = {
                    user_id: +user.dataValues.user_id,
                    email: data.email,
                    account_number: accountNumber,
                };

                return result;
            });

            return result;
        } catch (error) {
            throw error;
        }
    }

    async login(data) {
        try {
            const user = await this.#repository.userRepository.findOne({
                email: data.email,
            });

            if (!user) {
                throw "User with email " + data.email + " not found";
            }

            if (!Bcrypt.compare(data.password, user.dataValues.password)) {
                throw "Invalid Password";
            }

            const jwt = new JWT();
            return {
                access_token: jwt.generate({
                    user_id: +user.dataValues.user_id,
                    email: user.dataValues.email,
                }),
            };
        } catch (error) {
            throw error;
        }
    }

    async getDetail(data) {
        try {
            let user = await this.#repository.userRepository.findOne({
                email: data.email,
            });

            if (!user) {
                throw "Invalid user";
            }

            let account = await this.#repository.accountRepository.findOne({
                user_id: data.user_id,
            });

            if (!account) {
                throw "No account found";
            }

            return {
                email: data.email,
                balance: new Decimal(account.dataValues.balance),
            };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = { UserUsecase };

const { AccountRepository } = require("./account_repository");
const { TransactionRepository } = require("./transaction_repository");
const { UserRepository } = require("./user_repositoriy");

class Repository {
    userRepository;
    accountRepository;
    transactionRepository;
    #models;
    #db;

    constructor(models, db) {
        this.userRepository = new UserRepository(models.user);
        this.accountRepository = new AccountRepository(models.account);
        this.transactionRepository = new TransactionRepository(
            models.transaction
        );
        this.#models = models;
        this.#db = db;
    }

    async withTransaction(fn) {
        // Call Transaction
        const tx = await this.#db.transaction();

        // Inject repository and set transaction
        const userRepo = new UserRepository(this.#models.user);
        userRepo.setTransaction(tx);

        const accountRepo = new AccountRepository(this.#models.account);
        accountRepo.setTransaction(tx);

        const transactionRepo = new TransactionRepository(
            this.#models.transaction
        );

        transactionRepo.setTransaction(tx);

        const tempRepo = {
            userRepository: userRepo,
            accountRepository: accountRepo,
            transactionRepository: transactionRepo,
        };

        try {
            const result = await fn(tempRepo, tx);
            await tx.commit();
            return result;
        } catch (error) {
            await tx.rollback();
            console.log(error.message);
            throw error.message;
        }
    }
}

module.exports = { Repository };

class TransactionRepository {
    #transactionModel;
    #transaction;
    constructor(transactionModel) {
        this.#transactionModel = transactionModel;
        this.#transaction = null;
    }

    setTransaction(t) {
        this.#transaction = t;
    }

    async create(data) {
        return this.#transactionModel.create(data, {
            transaction: this.#transaction,
        });
    }
}

module.exports = { TransactionRepository };

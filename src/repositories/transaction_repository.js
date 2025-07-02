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
}

module.exports = { TransactionRepository };

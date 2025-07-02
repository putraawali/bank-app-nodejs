const { db } = require("../connections/pg");

const User = require("./user_model")(db);
const Account = require("./account_model")(db);
const Transaction = require("./transaction_model")(db);

module.exports = {
    db,
    User,
    Account,
    Transaction,
};

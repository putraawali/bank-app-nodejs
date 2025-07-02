require("dotenv").config();

const { Sequelize } = require("sequelize");
const { db } = require("../src/connections/pg");

const queryInterface = db.getQueryInterface();

async function run() {
    const migrations = [
        require("./1_user_migration"),
        require("./2_account_migration"),
        require("./3_transaction_migration"),
    ];

    for (const migration of migrations) {
        await migration.up(queryInterface, Sequelize);
    }

    console.log("migrations complete");
    await db.close();
}

run().catch(console.log);

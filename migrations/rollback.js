require("dotenv").config();

const { Sequelize } = require("sequelize");
const { db } = require("../src/connections/pg");

const queryInterface = db.getQueryInterface();

async function run() {
    const migrations = [
        require("./3_transaction_migration"),
        require("./2_account_migration"),
        require("./1_user_migration"),
    ];

    for (const migration of migrations) {
        await migration.down(queryInterface, Sequelize);
    }

    console.log("rollback complete");
    await db.close();
}

run().catch(console.log);

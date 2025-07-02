const { Sequelize } = require("sequelize");

const db = new Sequelize({
    dialect: "postgres",
    database: process.env.PG_DATABASE_NAME,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialectOptions: {},
});

module.exports = { db };

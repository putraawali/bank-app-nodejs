module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("transactions", {
            transaction_id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            from_account_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "accounts",
                    key: "account_id",
                },
                onDelete: "CASCADE",
            },
            to_account_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "accounts",
                    key: "account_id",
                },
                onDelete: "CASCADE",
            },
            amount: {
                type: Sequelize.DECIMAL(18, 2),
                allowNull: false,
            },
            transaction_type: {
                type: Sequelize.ENUM("deposit", "withdraw", "transfer"),
                allowNull: false,
            },
            created_at: {
                type: "TIMESTAMP(0) WITHOUT TIME ZONE",
                allowNull: false,
            },
            updated_at: {
                type: "TIMESTAMP(0) WITHOUT TIME ZONE",
                allowNull: true,
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable("transactions");
    },
};

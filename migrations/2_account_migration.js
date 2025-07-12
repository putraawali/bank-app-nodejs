module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("accounts", {
            account_id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: Sequelize.BIGINT,
                allowNull: false,
                references: {
                    model: "users",
                    key: "user_id",
                },
                onDelete: "CASCADE",
            },
            account_number: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            pin: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            balance: {
                type: Sequelize.DECIMAL(18, 2),
                allowNull: false,
                defaultValue: "0.00",
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

        await queryInterface.addConstraint("accounts", {
            fields: ["balance"],
            type: "check",
            name: "check_balance_non_negative",
            where: {
                balance: {
                    [Sequelize.Op.gte]: 0,
                },
            },
        });
    },

    down: async (queryInterface) => {
        await queryInterface.dropTable("accounts");
    },
};

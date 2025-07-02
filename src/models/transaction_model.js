const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Transaction = sequelize.define(
        "Transaction",
        {
            transaction_id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            from_account_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            to_account_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            amount: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            transaction_type: {
                type: DataTypes.ENUM("deposit", "withdraw", "transfer"),
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: null,
            },
        },
        {
            tableName: "transactions",
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            deletedAt: false,
        }
    );

    Transaction.associate = (model) => {
        Transaction.belongsTo(model.Account, {
            foreignKey: "from_account_id",
            as: "from_account",
        });

        Transaction.belongsTo(model.Account, {
            foreignKey: "to_account_id",
            as: "to_account",
        });
    };

    return Transaction;
};

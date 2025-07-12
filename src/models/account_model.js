const { DataTypes, Sequelize } = require("sequelize");
const { db } = require("../connections/pg");
const { Bcrypt } = require("../utils/bcrypt");

// db.define("Asd", {
//     user_id: {
//         references: {

//         }
//     }
// })

module.exports = (sequelize) => {
    const Account = sequelize.define(
        "Account",
        {
            account_id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            account_number: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            pin: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            balance: {
                type: DataTypes.DECIMAL(18, 2),
                // allowNull: false,
                default: "0.00",
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
            tableName: "accounts",
            createdAt: "created_at",
            updatedAt: "updated_at",
            underscored: true,
            deletedAt: false,
            hooks: {
                beforeCreate: (account) => {
                    if (account.pin.length !== 6) {
                        throw new Error(
                            "PIN should be minimum 6 characters and numeric"
                        );
                    }

                    for (let i = 0; i < account.pin.length; i++) {
                        if (isNaN(+account.pin[i])) {
                            throw new Error("PIN Should be number");
                        }
                    }

                    account.pin = Bcrypt.hash(account.pin);
                },
            },
        }
    );

    Account.associate = (model) => {
        Account.belongsTo(model.User, { foreignKey: "user_id" });

        Account.hasMany(model.Transaction, {
            foreignKey: "to_account_id",
            as: "sent_transactions",
        });

        Account.hasMany(model.Transaction, {
            foreignKey: "from_account_id",
            as: "received_transactions",
        });
    };

    return Account;
};

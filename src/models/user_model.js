const { DataTypes } = require("sequelize");
const { Bcrypt } = require("../utils/bcrypt");

module.exports = (sequelize) => {
    const User = sequelize.define(
        "User",
        {
            user_id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    validatePassword: (password) => {
                        if (password.length < 8) {
                            throw new Error(
                                "Password must be more than equal 8 characters"
                            );
                        }

                        const pattern =
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;

                        if (!password.match(pattern)) {
                            throw new Error(
                                "Password should be alphanumeric and should be  contain at least 1 capital letters and contain at least 1 special characters."
                            );
                        }
                    },
                },
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
            tableName: "users",
            createdAt: "created_at",
            updatedAt: "updated_at",
            deletedAt: false,
            underscored: true,
            hooks: {
                beforeCreate: (user, _) => {
                    user.password = Bcrypt.hash(user.password);
                },
            },
        }
    );

    User.associate = (models) => {
        User.hasOne(models.Account, { foreignKey: "user_id" });
    };

    return User;
};

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable("users", {
            user_id: {
                type: Sequelize.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("users");
    },
};

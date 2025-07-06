require("dotenv").config();

const { db } = require("./src/connections/pg");
const { App } = require("./src/app");
const PORT = process.env.APP_PORT || 3000;

(async () => {
    try {
        await db.authenticate();
        console.log("Postgres Connected Successfully");

        // const { app } = createApp({ db });

        const apps = new App({ db });
        const app = apps.getApp();

        app.listen(PORT, () => {
            console.log("Server running on port:", PORT);
        });
    } catch (error) {
        console.log("Failed connect to DB,", error);
    }
})();

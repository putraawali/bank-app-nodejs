const { JWT } = require("../utils/jwt");

class Middleware {
    static async authentication(req, res, next) {
        try {
            const skipper = {
                "/user/login": true,
                "/user/register": true,
            };

            if (skipper[req.originalUrl]) {
                return next();
            }

            let accessToken = req.headers.authorization;
            if (
                accessToken !== undefined &&
                accessToken.startsWith("Bearer ")
            ) {
                const token = accessToken.split(" ")[1];
                const jwt = new JWT();

                const userData = jwt.verify(token);
                console.log(userData);
                req.userData = userData;
                return next();
            }

            return next();
        } catch (error) {
            throw error;
        }
    }
}

module.exports = { Middleware };

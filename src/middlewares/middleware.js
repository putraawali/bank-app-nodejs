const { JWT } = require("../utils/jwt");
const { Response } = require("../utils/response");
const { v4: uuidv4 } = require("uuid");
// const { logger } = require("./utils/logger");
const { logger } = require("../utils/logger");

class Middleware {
    static async authentication(req, _, next) {
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

    static validateXRequestId(req, _, next) {
        if (!req.headers["x-request-id"]) {
            let xRequestId = uuidv4();
            req.headers["x-request-id"] = xRequestId;
        }

        next();
    }

    static validateContentType(req, _, next) {
        if (req.method !== "GET") {
            if (req.headers["content-type"] !== "application/json") {
                throw new Response({
                    code: 400,
                    error: "Invalid Content-Type",
                    detail: "Content-Type should be application/json",
                });
            }
        }

        next();
    }

    static logRequest(req, _, next) {
        let headers = [];
        for (let key in req.headers) {
            headers.push(`${key}: ${req.headers[key]}`);
        }

        let defaultMeta = {
            service: process.env.APP_NAME,
            method: req.method,
            headers: headers.join("|"),
            host: req.host,
            endpoint: req.url,
            type: "request",
        };

        let body = "";

        if (req.method !== "GET") {
            body = req.body;
        }

        logger.info({ message: body, ...defaultMeta });
        next();
    }

    static logResponse(req, res, next) {
        const start = Date.now();
        const originalSend = res.json;

        res.json = (body) => {
            const duration = Date.now() - start;

            let headers = [];
            for (let key in req.headers) {
                headers.push(`${key}: ${req.headers[key]}`);
            }

            let defaultMeta = {
                service: process.env.APP_NAME,
                method: req.method,
                headers: headers.join("|"),
                host: req.host,
                endpoint: req.url,
                duration: `${duration}ms`,
                type: "response",
            };

            const content = { message: body, ...defaultMeta };
            if (res.statusCode >= 400) {
                logger.error(content);
            } else {
                logger.info(content);
            }

            return originalSend.call(this, body);
        };

        next();
    }

    static errorHandler(err, _, res, _) {
        if (err instanceof Response) {
            return res.status(err.code).json(err.send());
        }

        let msg = "Internal server error";
        let detail = err;
        let code = 500;

        if (typeof err === String && err.startsWith("Validation error: ")) {
            msg = err.split("Validation error: ")[1];
            code = 400;
        }

        const response = new Response({ code, error: msg, detail });
        return res.status(response.code).json(response.send());
    }
}

module.exports = { Middleware };

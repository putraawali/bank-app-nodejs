const bcrypt = require("bcryptjs");
const SALT = +process.env.SALT || 8;

class Bcrypt {
    static hash(password) {
        return bcrypt.hashSync(password, SALT);
    }

    static compare(password, encryptedPassword) {
        return bcrypt.compareSync(password, encryptedPassword);
    }
}

module.exports = { Bcrypt };

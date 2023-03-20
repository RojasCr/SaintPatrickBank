const bcrypt = require("bcrypt");

const saltRound = 10;
const salt = bcrypt.genSaltSync(saltRound);

const cryptPassword = (password) => {
    const passwordCrypted = bcrypt.hashSync(password,salt);
    return passwordCrypted;
}

const comparePassword = (password, passwordCrypted) => {
    const passwordsCompared = bcrypt.compareSync(password, passwordCrypted);
    return passwordsCompared;
}

module.exports = {cryptPassword, comparePassword};
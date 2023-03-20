const mongoose = require("mongoose");

const userCollection = "users";

const userSchema = new mongoose.Schema({
    card_number: {
        type: Number,
        unique: true
    },
    pin: String,
    saldo: Number,
    transacciones: {
        type: Array,
        default: []
    }
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;
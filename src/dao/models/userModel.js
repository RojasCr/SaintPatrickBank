const mongoose = require("mongoose");

const userCollection = "users";

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true
    },
    card_number: {
        type: Array,
        default: []
    },
    pin: String,
    saldo: {
        type: Number,
    },
    transacciones: {
        type: Array,
        default: []
    },
    email: {
        type: String,
        unique: true
    }
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;
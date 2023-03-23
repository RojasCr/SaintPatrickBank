const { Router } = require("express");
const { cryptPassword } = require("../crypt/crypter");
const router = Router();
const userManager = require("../dao/models/userModel");



module.exports = router;
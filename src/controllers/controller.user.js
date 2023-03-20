const { Router } = require("express");
const { cryptPassword } = require("../crypt/crypter");
const router = Router();
const userManager = require("../dao/models/userModel");

router.post("/", async(req, res) => {
    try {
        const {card_number, pin, saldo} = req.body;
        const newUser = {
            card_number,
            pin: cryptPassword(pin),
            saldo
        }
        
        const result = await userManager.create(newUser);
        res.json(result);
    } catch (error) {
        console.log(error)
    }
})

module.exports = router;
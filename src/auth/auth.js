const cookieParser = require("cookie-parser");
const { Router } = require("express");
const { sendMail } = require("../controllers/controller.mail");
const { comparePassword } = require("../crypt/crypter");
const router = Router();
const userManager = require("../dao/models/userModel");
const { generateToken, validateToken } = require("../utils/jwt.utils");


router.post("/", async(req, res) => {
    try {
        const {card_number, pin} = req.body;
        const user = await userManager.findOne({card_number});
        const isValidPassword = comparePassword(pin, user.pin);
        
        if(!user || !isValidPassword){
            return res.json({message: "Usuario y/o contraseña incorrectos"})
        }

        const userStr=JSON.stringify(user)
        const userObj=JSON.parse(userStr)
        const token = generateToken(userObj)
        
        
        res.cookie("accessToken", token, {
            maxAge: 15000,
            httpOnly: true,
        })

        res.cookie("user", userObj,{
            maxAge: 15000,
            httpOnly: true
        });
        //req.session.user = user
        /*req.session.user = user{
            card_number: user.card_number,
            pin: user.pin,
            saldo: user.saldo
        }*/
        //console.log(req.cookies)
        //res.json({message: "Inicio exitoso"});
        return res.redirect("/");
    } catch (error) {
        console.log(error);
    }
})

router.post("/newOrder",async(req, res) => {
    try {

        if(!req.cookies.accessToken){
            return res.redirect("/login");
        }
        const {date, destino, monto} = req.body;
        const userSession = req.cookies.user;
        const card_number = userSession.card_number;
        const saldoUser = userSession.saldo;

        const userDestino = await userManager.findOne({card_number: destino});
        const saldoDestino = userDestino.saldo;
        
        
        await userManager.updateOne({card_number}, {$addToSet: {transacciones: {date, destino, monto}}, $set: {saldo: saldoUser - monto}});
        await userManager.updateOne({card_number: destino}, {$set: {saldo: saldoDestino + Number(monto)}})

        const user = await userManager.findOne({card_number});
        

        //console.log(req.cookies.user)
        sendMail(req, res);

        res.cookie("user", user, {maxAge: 15000, httpOnly: true}).redirect("/transacciones");
        //res.json(saldoDestino);
    } catch (error) {
        console.log(error)
    }
})

router.get("/logout", (req, res) => {
    // req.session.destroy(err => {
    //     console.log(err);
    // })

    
    res.clearCookie("accessToken").clearCookie("user").redirect("/login");
})

module.exports = router;
//const cookieParser = require("cookie-parser");
const { Router } = require("express");
const { sendMailEmisor, sendMailReceptor } = require("../controllers/controller.mail");
const { comparePassword, cryptPassword } = require("../crypt/crypter");
const generateRandom = require("../dao/generateCard/generateRandom");
const router = Router();
const userManager = require("../dao/models/userModel");
const { generateToken, validateToken } = require("../utils/jwt.utils");


//Signup
router.post("/signup", async(req, res) => {
    try {
        const {user, pin, email} = req.body;

        const userDb = await userManager.findOne({user});

        if(userDb){
            return res.status(400).json({message: "El usuario ya está en uso"});
        }
        
        const newUser = {
            user,
            card_number: [generateRandom(9),generateRandom(9)],
            pin: cryptPassword(pin),
            saldo: generateRandom(6),
            email
        }
        
        const result = await userManager.create(newUser);

        if(result){
            return res.redirect("/login");
        }
        res.json({message: "Usuario creado"});
    } catch (error) {
        console.log(error)
    }
})



//Login authentication
router.post("/login", async(req, res) => {
    try {
        const {user, pin} = req.body;
        const userDb = await userManager.findOne({user});
        const isValidPassword = comparePassword(pin, userDb.pin);
        
        if(!userDb || !isValidPassword){
            return res.json({message: "Usuario y/o contraseña incorrectos"})
        }

        const userStr=JSON.stringify(userDb)
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


//New order authentication
router.post("/newOrder",async(req, res) => {
    try {
        
        if(!req.cookies.accessToken){
            return res.redirect("/login");
        }
        const {date, destino, monto} = req.body;
        const user = req.cookies.user;
        const userSession = user.user;
        //const card_number = userSession.card_number;
        const saldoUser = req.cookies.user.saldo;
        
        const userDestino = await userManager.findOne({user: destino});
        const saldoDestino = userDestino.saldo;
        
        
        await userManager.updateOne({user: userSession}, {$addToSet: {transacciones: {date, destino, monto}}, $set: {saldo: saldoUser - monto}});
        await userManager.updateOne({user: destino}, {$set: {saldo: saldoDestino + Number(monto)}})
        
        const userDb = await userManager.findOne({user: userSession});
        
        
        //console.log(req.cookies.user)
        sendMailEmisor(req, res);
        sendMailReceptor(req, res);
        
        const userStr=JSON.stringify(userDb)
        const userObj=JSON.parse(userStr)
        //console.log(userObj)
        res.cookie("user", userObj, {maxAge: 15000, httpOnly: true}).redirect("/transacciones");
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
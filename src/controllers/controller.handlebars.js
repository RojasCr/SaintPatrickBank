const {Router} = require("express");
//const userModel = require("../dao/models/userModel");
const { validateToken } = require("../utils/jwt.utils");
const router = Router();

//Middlewares de acceso
const privateAccess = (req, res, next) => {
    /*if(!req.session.user){
        return res.redirect("/login");
    }*/
    if(!req.cookies.accessToken){
        return res.redirect("/login");
    }
    next();
}

const publicAccess = (req, res, next) => {
    // if(req.session.user){
    //     return res.redirect("/");
    // }
    if(req.cookies.accessToken){
        return res.redirect("/");
    }
    next();
}

//Plantillas

router.get("/signup", publicAccess, (req, res) => {
    res.render("signup", {style: "/css/signup.css"})
})

router.get("/login", publicAccess,(req, res) => {
    //console.log("gols")
    res.render("login", {style: "/css/login.css"});
})

router.get("/", validateToken,(req, res) => {
    const user = req.cookies.user;
    //const {card_number} = req.cookies.user/*req.session.user*/;
    //const user = await userModel.findOne({card_number});
    //const userStr = JSON.stringify(user);
    //const userObj = JSON.parse(user);
    //console.log(user)
    //const {user} = req.session;
    //setTimeout(() => {res.clearCookie("accessToken"); console.log("cookie borrada")}, 15000);
    res.cookie("accessToken", req.cookies.accessToken,{/*maxAge: 15000,*/ httpOnly:true}).render("home", {user, style:"css/home.css"});
})

router.get("/transacciones", privateAccess,(req, res) => {
    // const {card_number} = req.cookies.user/*req.session.user*/;
    // const user = await userModel.findOne({card_number});
    // req.cookies.user = user
    //console.log(user)
    // const userStr = JSON.stringify(user);
    // const userObj = JSON.parse(userStr);
    const user = req.cookies.user;
    console.log(new Date().toLocaleString())
    
    res.cookie("accessToken", req.cookies.accessToken,{/*maxAge: 15000,*/ httpOnly: true}).render("transacciones", {user, style:"css/transacciones.css"});
});

router.get("/nuevaOrden", privateAccess,(req, res) => {
    res.cookie("accessToken", req.cookies.accessToken,{/*maxAge: 15000,*/ httpOnly: true}).render("nuevaOrden",{style: "css/nuevaOrden.css"})
})

module.exports = router;
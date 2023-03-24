const jwt = require("jsonwebtoken");
require("dotenv").config();

const generateToken = (user) => {
    const token = jwt.sign({user}, process.env.SECRET_KEY/*, {expiresIn: "1m"}*/);
    
    return token;
}

const validateToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if(!accessToken){
        return res.redirect("/login")
        //return res.send("No puede ingresar");
    }

    jwt.verify(accessToken, process.env.SECRET_KEY, (err, credentials) => {
        //console.log(accessToken)
        if(err) return res.status(401).send("Acceso denegado");

        //req.user = credentials.user;
        if(!req.cookies.user){
            return res.cookie("user", credentials.user, {/*maxAge: 15000,*/ httpOnly: true});
        }
        return res.cookie("user", req.cookies.user, {/*maxAge: 15000,*/ httpOnly: true});
        //console.log(req.cookies.user)
    })

    next();
}

module.exports = {generateToken, validateToken}
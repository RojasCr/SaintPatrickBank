//const { Router, json } = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config();

//const router = Router();

//router.post("/", (req, res) => {
const sendMail = (req, res) =>{
    const {email, date, monto} = req.body;

    const transporter = nodemailer.createTransport({
        host: process.env.NM_HOST,
        port: process.env.NM_PORT,
        secure: true,
        auth: {
            user: process.env.NM_USER,
            pass: process.env.NM_PASS
        }
    });

    const mailOptions = {
        from: process.env.NM_USER,
        to: email,
        subject: "Transacción exitosa",
        text: `Su transacción del día ${date} de $${monto} fue generada con éxito.`
    };

    transporter.verify()
    .then(response => console.log(response))
    .catch(error => console.log(error))

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            return console.log(err);
        }
        console.log("Email sent");
        return res.status(200).send(mailOptions.text);
    })
};

module.exports = {sendMail};
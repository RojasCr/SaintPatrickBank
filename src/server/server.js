const express = require("express");
const handlebarsConfig = require("../config/config.handlebars");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
require("dotenv").config();

const app = express();
handlebarsConfig(app);

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(process.cwd()+"/src/public"))

app.use(cookieParser());
/*app.use(session({
    store: MongoStore.create({
        mongoUrl:"mongodb+srv://coderBackend:descartes1@cluster0.9dxtyf1.mongodb.net/sessionsBank?retryWrites=true&w=majority",
        mongoOptions:{useNewUrlParser: true},
        //ttl: 15
    }),
    secret: "secretBank",
    resave: false,
    saveUninitialized: false,
    //cookie: {maxAge: 3000}
}))*/



mongoose.connect(
    `mongodb+srv://${process.env.DB_CLUSTER}:${process.env.DB_PASSWORD}@cluster0.9dxtyf1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true
    }
)
.then(() => console.log("DB connected"))
.catch(error => console.log(error))

module.exports = {app};
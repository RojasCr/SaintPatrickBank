//const { app } = require("../server/server");
const handlebarsController = require("../controllers/controller.handlebars");
const userController = require("../controllers/controller.user")
const authController = require("../auth/auth");
const mailController = require("../controllers/controller.mail")

const router = (app) => {
    app.use("/", handlebarsController);
    //app.use("/user", userController);
    app.use("/auth", authController);
    //app.use("/mail", mailController);
}

module.exports = router;
const handlebars = require("express-handlebars");

const handlebarsConfig = (app) => {
    app.engine("handlebars", handlebars.engine());
    app.set("view engine", "handlebars");
    app.set("views", process.cwd() + "/src/views");
}

module.exports = handlebarsConfig;
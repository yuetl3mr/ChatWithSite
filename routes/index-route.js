const homeRouter = require("./home-route");
const responseRouter = require("./response-route");

module.exports = (app) => {
    app.use("/", homeRouter);
    app.use("/response", responseRouter);
};
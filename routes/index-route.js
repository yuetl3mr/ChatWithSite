const homeRouter = require("./home-route");
const responseRouter = require("./response-route");
const userRouter = require("./user-route");
const notebookRouter = require("./notebook-route");
const noteRouter = require("./note-route");

module.exports = (app) => {
    app.use("/", homeRouter);
    app.use("/user", userRouter);
    app.use("/response", responseRouter);
    app.use("/notebook", notebookRouter);
    app.use("/note", noteRouter);
};
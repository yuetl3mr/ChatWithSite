const express = require("express");
const route = require("./routes/index-route");
const methodOverride = require('method-override');


const port = 3000;
const app = express();

app.use(methodOverride("_method"));

// Pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

route(app);

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});
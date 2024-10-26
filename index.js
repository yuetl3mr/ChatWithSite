const express = require("express");
const route = require("./routes/index-route");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');


const port = 3000;
const app = express();

app.use(methodOverride("_method"));

app.use(express.static(`${__dirname}/public`));

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

route(app);

app.listen(port, () => {
    console.log(`App listen on port ${port}`);
});
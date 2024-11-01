const express = require("express");
const route = require("./routes/index-route");
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const database = require("./config/database");
const cookieParser = require('cookie-parser');
const flash = require('express-flash');
const session = require('express-session');  

const port = 3000;
const app = express();
database.connect();

app.use(methodOverride("_method"));
app.use(express.static(`${__dirname}/public`));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: 'i love cat :3',  
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// Flash
app.use(flash());

// Pug setup
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Routes
route(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});

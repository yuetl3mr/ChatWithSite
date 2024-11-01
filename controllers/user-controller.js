const md5 = require("md5");
const generateHelper = require("../helpers/generate");
const User = require("../models/user-model");


// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("pages/user/register", {
        pageTitle: "Register an Account",
    });
};

module.exports.registerPost = async (req, res) => {
    const existUser = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (existUser) {
        // req.flash("error", "Email already exists!");
        res.redirect("back");
        return;
    }

    const userData = {
        userName: req.body.fullName,
        email: req.body.email,
        password: md5(req.body.password),
        token: generateHelper.generateRandomString(20)
    };

    const user = new User(userData);
    await user.save();

    res.cookie("tokenUser", user.token);

    // req.flash("success", "Account registration successful!");
    res.redirect("/");
};


// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("pages/user/login", {
        pageTitle: "Login",
    });
};


// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const user = await User.findOne({
        email: req.body.email,
        deleted: false
    });
    console.log(req.body.email);
    if (!user) {
        req.flash("error", "Error!");
        res.redirect("back");
        return;
    }
    // if (md5(req.body.password) != user.password) {
    //     res.redirect("back");
    //     return;
    // }
    if (req.body.password != user.password) {
        res.redirect("back");
        return;
    }
    if (user.deleted != false) {
        res.redirect("back");
        return;
    }
    console.log("OK");
    res.cookie("tokenUser", user.token);
    res.cookie("tokenId", user._id);
    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/user/login");
};
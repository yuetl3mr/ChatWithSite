const User = require("../models/user-model");

module.exports.requireAuth = async (req, res, next) => {
  if(!req.cookies.tokenUser) {
    res.redirect("/user/login");
    return;
  }

  const user = await User.findOne({
    token: req.cookies.tokenUser,
    deleted: false
  }).select("userName email avatar");

  if(!user) {
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  res.locals.user = user;
  next();
}
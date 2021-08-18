const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
    const varifyUser = jwt.verify(token, "mynameisshyamnarayanwebdeveloper");
    console.log(varifyUser);
    if (!varifyUser) res.send({ message: "You are not login" });
    next();
  } catch (error) {
    res.send({ message: "session is time out" });
  }
};

module.exports = userAuth;

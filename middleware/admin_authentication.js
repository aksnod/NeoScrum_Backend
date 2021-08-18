const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const varifyUser = jwt.verify(
      token,
      "adminmynameisshyamnarayanwebdeveloper"
    );
    //console.log(varifyUser);
    if (!varifyUser) res.send({ message: "You are not login" });
    next();
  } catch (error) {
    res.send({ message: "session is time out" });
  }
};

module.exports = userAuth;

const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.signUp = async function (req, res) {
  try {
    // const obj = JSON.parse(JSON.stringify(req.body));
    console.log(req.body.email);
    const isAdmin = await Admin.findOne({ email: req.body.email });

    if (!isAdmin) {
      const admin = {
        name: req.body.name,
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 8),
      };

      const newAdmin = await Admin.create(admin);

      res.status(200).json({
        message: "Sign-up successfully",
        data: newAdmin,
      });
    } else {
      res.status(401).json({
        message: "admin already exist",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: "Error " + error,
    });
  }
};

module.exports.createSession = async function (req, res) {
  try {
    console.log(req.body.password);
    let admin = await Admin.findOne({ email: req.body.email });
    console.log(admin);
    const match = await bcrypt.compare(req.body.password, admin.password);
    if (!admin || !match) {
      return res.status(422).json({
        message: "Invalid admin or password",
      });
    }
    token = await admin.generateAuthToken();
    // res.cookie("id", admin._id, {
    //   expires: new Date(Date.now() + 100000),
    // });
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 100000),
    });

    res.send(200, { token: token });
  } catch (err) {
    return res.json(501, {
      meassage: "Internal server error" + err,
    });
  }
};

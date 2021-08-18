const User = require("../models/user");
const bcrypt = require("bcrypt");
const schema = require("../validater/user_validater");
const mailer = require("../mailers/sign_up_mailer");
const jwt = require("jsonwebtoken");
const cronJob = require("cron").CronJob;

module.exports.signUp = async function (req, res) {
  try {
    // const obj = JSON.parse(JSON.stringify(req.body));
    if(!req.file || req.fileValidationError || !req.file.mimetype=='image/jpeg' || !req.file.mimetype=='image/png'){
     return res.status(401).json({
        message:"Plz choose right image type"
      })
    }
    const userValidated = await schema.validateAsync(req.body);

    if (userValidated) {
      const isUser = await User.findOne({ email: req.body.email });

      if (!isUser) {
        let buffer = req.file.buffer;
        const pass = '123456';
        console.log(pass);
        const user = {
          name: req.body.name,
          email: req.body.email,
          password: await bcrypt.hash(pass, 8),
          avatar: buffer,
        };

        const newUser = await User.create(user);
        mailer.signUpMailer(pass, newUser.email);
        res.status(200).json({
          message: "Sign-up successfully",
          data: newUser,
        });
      } else {
        res.status(401).json({
          message: "user already exist",
        });
      }
    }
  } catch (error) {
    res.status(401).json({
      message: "Error " + error,
    });
  }
};

function passwordGenrater() {
  const code =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@-/";
  let password = "";
  for (var i = 0; i < 8; i++) {
    password += code.charAt(Math.floor(Math.random() * code.length));
  }
  return password;
}

module.exports.createSession = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    const match = await bcrypt.compare(req.body.password, user.password);
    if (!user || !match) {
      return res.status(422).json({
        message: "Invalid user or password",
      });
    }
    token = await user.generateAuthToken();
    res.cookie("id", user._id, {
      expires: new Date(Date.now() + 100000),
    });
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

module.exports.dashboard = async function (req, res) {
  try {
    const user = await User.find(
      { _id: { $ne: req.cookies.id } },
      { password: 0, avatar: 0, tokens: 0, email: 0 }
    );

    if (user.length > 0) res.send({ user: user });
    else res.send({ message: "Theere is no feedback" });
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
};

module.exports.feedback = async function (req, res) {
  try {
    const user = await User.findById(req.params.id);
    //console.log(req.cookies.jwt);
    if (user) {
      const feedbac = {
        _id: req.cookies.id, //initilize current user data        feedback: req.body.feedback,
      };
      user.feedbacks.push(feedbac);
      await user.save();
      res.send({ message: "feedback posted" });
    } else {
      res.send({ message: "You are not in database" });
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
};

module.exports.getReceivers = async function (req, res) {
  try {
    const user = await User.find(
      { _id: { $ne: req.cookies.id } },
      { password: 0, tokens: 0, avatar: 0 }
    );
    const existUser = await User.findOne(
      { _id: req.cookies.id },
      {
        password: 0,

        tokens: 0,
        avatar: 0,
      }
    );
    let notReceiver = [];
    for (let i = 0; i < user.length; i++) {
      let j = 0;
      for (; j < existUser.feedbacks.length; j++) {
        if (user[i]._id + "" === existUser.feedbacks[j]._id + "") {
          // console.log(user[i]._id);
          break;
        }
      }
      if (j == existUser.feedbacks.length) notReceiver.push(user[i]);
    }
    console.log(notReceiver);
    if (user.length > 0) res.send({ user: notReceiver });
    else res.send({ message: "Theere is no user" });
  } catch (error) {
    console.log(error);
    res.send({ error: error });
  }
};

const job = new cronJob(
  "0 0 * * fri",
  async function () {
    const user = await User.updateMany({ $set: { feedbacks: [] } });
    console.log(user);
  },
  null,
  true,
  "Asia/Kolkata"
);
job.start();

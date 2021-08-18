const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 7,
    },
    tokens:{
       type: String, 
       required: true 
      
    },
    avatar: {
      type: Buffer,
    },
    feedbacks: [
      {
        feedback: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async function () {
  try {
    const SECRET_KEY = "mynameisshyamnarayanwebdeveloper";
    let token = await jwt.sign({ _id: this._id }, SECRET_KEY);
    this.tokens = token
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("User", userSchema);

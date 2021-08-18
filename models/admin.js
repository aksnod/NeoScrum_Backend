const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const adminSchema = new mongoose.Schema(
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
    tokens: [
      {
        token: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

adminSchema.methods.generateAuthToken = async function () {
  try {
    const SECRET_KEY = "adminmynameisshyamnarayanwebdeveloper";
    let token = await jwt.sign({ _id: this._id }, SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model("Admin", adminSchema);

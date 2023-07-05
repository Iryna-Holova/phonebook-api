const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");

const emailRegexp = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "missing required 'name' field"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [emailRegexp, "invalid email"],
      required: [true, "missing required 'email' field"],
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "password must contain at least 6 characters"],
      required: [true, "missing required 'password' field"],
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, "Verify token is required"],
    },
  },
  { versionKey: false }
);

userSchema.methods.hashPassword = async function (password) {
  this.password = await bcrypt.hash(password, 10);
};

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("user", userSchema);

module.exports = User;

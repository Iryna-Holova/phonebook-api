const path = require("path");
const fs = require("fs/promises");
const { uid } = require("uid");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const Jimp = require("jimp");

const db = require("../services/users-services");
const sendEmail = require("../helpers/sendEmail");

const { SECRET_KEY, BASE_URL } = process.env;

const avatarDir = path.resolve("public", "avatars");

const signUp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db.findUser({ email });
    if (user) {
      return res.status(409).json({
        message: "Email in use",
      });
    }

    const verificationToken = uid();
    const avatarURL = gravatar.url(email);

    const newUser = await db.addUser({
      ...req.body,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Phonebook email verification",
      html: `<a target="_blank" href="${BASE_URL}/users/verify/${verificationToken}">Click to verify email</a>`,
    };

    await sendEmail(verifyEmail);

    const payload = { id: newUser._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await db.updateById(newUser._id, { token });

    res.status(201).json({
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        avatarURL,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verify = async (req, res) => {
  try {
    const { verificationToken } = req.params;
    const user = await db.findUser({ verificationToken });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await db.updateById(user._id, {
      verify: true,
      verificationToken: null,
    });

    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resendVerify = async (req, res) => {
  //   const { email } = req.body;
  //   const user = await User.findOne({ email });
  //   if (!user) {
  //     throw HttpError(401, "User not found");
  //   }
  //   if (user.verify) {
  //     throw HttpError(400, "Verification has already been passed");
  //   }
  //   const verifyEmail = {
  //     to: email,
  //     subject: "Email verification",
  //     html: `<a target="_blank" href="${BASE_URL}/users/verify/${user.verificationToken}">Click to verify email</a>`,
  //   };
  //   await sendEmail(verifyEmail);
  //   res.json({
  //     message: "Verification email sent",
  //   });
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await db.findUser({ email });
    if (!user) {
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    }
    if (!user.verify) {
      return res.status(401).json({
        message: "Email is not verified",
      });
    }

    const isPassword = await db.checkPassword(user, password);
    if (!isPassword) {
      return res.status(401).json({
        message: "Email or password is wrong",
      });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    await db.updateById(user._id, { token });

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        avatarURL: user.avatarURL,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await db.updateById(_id, { token: null });

  res.status(204).send();
};

const getCurrent = (req, res) => {
  const { name, email, avatarURL } = req.user;

  res.json({
    name,
    email,
    avatarURL,
  });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: oldPath, filename } = req.file;
  const newName = `${_id}_${filename}`;
  const newPath = path.join(avatarDir, newName);

  await Jimp.read(oldPath)
    .then((image) => {
      image.cover(250, 250).write(newPath);
    })
    .catch((err) => {
      fs.unlink(oldPath);
      return res.status(400).json({
        message: err.message,
      });
    });

  fs.unlink(oldPath);
  const avatarURL = path.join("avatars", newName);
  await db.updateById(_id, { avatarURL });

  res.json({
    avatarURL,
  });
};

module.exports = {
  signUp,
  verify,
  resendVerify,
  login,
  logout,
  getCurrent,
  updateAvatar,
};

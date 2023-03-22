const {
  register,
  login,
  getUserById,
  saveToken,
  removeToken,
  updateSubscription,
} = require("../models/users");
const { User } = require("../db/modelUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const avatarSize = require("../helpers/avatarSizeHelpers");
const { nanoid } = require("nanoid");
const sendEmail = require("../helpers/nodemailer");
require("dotenv").config();
const { BASE_URL } = process.env;

const registrationAction = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login(email);
    if (user) {
      return res.status(409).json({
        message: "Email in use",
      });
    }
    const avatarURL = gravatar.url(email);
    const verificationToken = nanoid();
    const newUser = await register(
      email,
      password,
      avatarURL,
      verificationToken
    );
    const verifyEmail = {
      to: email,
      subject: "Verify you email",
      html: `<a target="_blank" href="${BASE_URL}/api/auth/users/verify/${verificationToken}"> Click to verify your email</a>`,
    };
    await sendEmail(verifyEmail);
    return res.status(201).json({
      user: newUser,
    });
  } catch (error) {
    next(error.message);
  }
};

const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    return res.status(404).json({
      message: "'User not found",
    });
  }
  await User.findByIdAndDelete(user._id, {
    verify: true,
    verificationToken: "",
  });
  res.json({ message: "Verification successful" });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      message: "'User not found",
    });
  }
  if (user.verify) {
    return res.status(400).json({
      message: "Verification has already been passed",
    });
  }
  const verifyEmail = {
    to: email,
    subject: "Verify you email",
    html: `<a target="_blank" href="${BASE_URL}/api/auth/users/verify/${user.verificationToken}"> Click to verify your email</a>`,
  };
  await sendEmail(verifyEmail);
  res.json({ message: "Verification email sent" });
};

const loginAction = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login(email);

    if (!user) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET_KEY
    );

    saveToken(user._id, token);

    return res.status(200).json({
      token: token,
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (error) {
    next(error.message);
  }
};

const logoutAction = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await getUserById(_id);

    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await removeToken(_id);
    return res.status(204).json();
  } catch (error) {
    next(error.message);
  }
};

const getCurrentUserAction = async (req, res, next) => {
  try {
    return res.status(200).json({
      user: { email: req.user.email, subscription: req.user.subscription },
    });
  } catch (error) {
    next(error.message);
  }
};

const updateSubscriptionAction = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const { subscription } = req.body;

    const updateUserSubscription = await updateSubscription(
      subscription,
      owner
    );
    if (!updateUserSubscription) {
      return res.status(400).json({ message: "Missing field subscription" });
    }
    return res.status(200).json({ message: "Contact was updated" });
  } catch (error) {
    next(error.message);
  }
};

const avatarsDir = path.join(__dirname, "../", "public", "avatars");
const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  await avatarSize(resultUpload);
  const avatarURL = path.join("avatars", filename);
  //
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({
    avatarURL,
  });
};

module.exports = {
  registrationAction,
  loginAction,
  logoutAction,
  getCurrentUserAction,
  updateSubscriptionAction,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};

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
    const newUser = await register(email, password, avatarURL);
    return res.status(201).json({
      user: newUser,
    });
  } catch (error) {
    next(error.message);
  }
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
};

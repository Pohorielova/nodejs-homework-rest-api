const {
  register,
  login,
  getUserById,
  saveToken,
  removeToken,
  updateSubscription,
} = require("../models/users");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registrationAction = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await login(email);
    if (user) {
      return res.status(409).json({
        message: "Email in use",
      });
    }

    const newUser = await register(email, password);
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

module.exports = {
  registrationAction,
  loginAction,
  logoutAction,
  getCurrentUserAction,
  updateSubscriptionAction,
};

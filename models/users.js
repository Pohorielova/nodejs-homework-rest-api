const { User } = require("../db/modelUser");

const register = async (email, password, avatarURL, verificationToken) => {
  const user = await new User({
    email,
    password,
    avatarURL,
    verificationToken,
  });
  return user.save();
};

const login = async (email, password) => {
  const user = await User.findOne({ email });
  return user;
};

const getUserById = async (_id) => {
  const user = await User.findOne({ _id });
  return user;
};

const saveToken = async (_id, token) => {
  return User.findByIdAndUpdate(_id, {
    $set: { token },
    runValidators: true,
  });
};

const removeToken = async (_id) => {
  return User.findByIdAndUpdate(_id, {
    $set: { token: null },
    runValidators: true,
  });
};

const updateSubscription = async (subscription, owner) => {
  return User.findByIdAndUpdate(owner, {
    $set: { subscription },
    runValidators: true,
  });
};

module.exports = {
  register,
  login,
  getUserById,
  saveToken,
  removeToken,
  updateSubscription,
};

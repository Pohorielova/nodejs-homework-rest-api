const jwt = require("jsonwebtoken");
const { User } = require("../db/modelUser");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(
      res.status(401).json({
        message: "Token is required",
      })
    );
  }

  try {
    const verify = jwt.verify(token, process.env.SECRET_KEY);
    if (!verify) {
      res.status(401).json({ message: "Invalid token" });
      return;
    }

    const user = await User.findById(verify._id);

    if (!user || user.token !== token) {
      next(
        res.status(401).json({
          message: "Not authorized",
        })
      );
    }

    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    next(
      res.status(401).json({
        message: error.message,
      })
    );
  }
};

module.exports = { authenticate };

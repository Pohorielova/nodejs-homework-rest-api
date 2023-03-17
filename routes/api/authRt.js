const express = require("express");

const router = express.Router();

const {
  registerNewUserValidation,
  loginValidation,
  subscriptionValidation,
} = require("../../middlewares/validation");

const { authenticate } = require("../../middlewares/authenticate");
const upload = require("../../middlewares/upload");

const { asyncWrapper } = require("../../helpers/apiHelpers");

const {
  registrationAction,
  loginAction,
  logoutAction,
  getCurrentUserAction,
  updateSubscriptionAction,
  updateAvatar,
} = require("../../controllers/authCtr");

router.post(
  "/users/register",
  registerNewUserValidation,
  asyncWrapper(registrationAction)
);
router.post("/users/login", loginValidation, asyncWrapper(loginAction));
router.post("/users/logout", authenticate, asyncWrapper(logoutAction));
router.get("/users/current", authenticate, asyncWrapper(getCurrentUserAction));
router.patch(
  "/users",
  authenticate,
  subscriptionValidation,
  asyncWrapper(updateSubscriptionAction)
);
router.patch(
  "/users/avatars",
  authenticate,
  upload.single("avatar"),
  asyncWrapper(updateAvatar)
);
module.exports = router;

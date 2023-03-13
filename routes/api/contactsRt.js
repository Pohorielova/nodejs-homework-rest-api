const express = require("express");

const router = express.Router();

const {
  addContactValidation,
  updateContactValidation,
  updateStatusContactValidation,
  objectIdValidation,
} = require("../../middlewares/validation");

const { authenticate } = require("../../middlewares/authenticate");

const { asyncWrapper } = require("../../helpers/apiHelpers");

const {
  getContactsListAction,
  getContactByIdAction,
  addContactAction,
  removeContactAction,
  updateContactAction,
  updateStatusContactAction,
} = require("../../controllers/contactsCtr");

router.use(authenticate);
router.get("/", asyncWrapper(getContactsListAction));
router.get(
  "/:contactId",
  objectIdValidation,
  asyncWrapper(getContactByIdAction)
);
router.post("/", addContactValidation, asyncWrapper(addContactAction));
router.delete(
  "/:contactId",
  objectIdValidation,
  asyncWrapper(removeContactAction)
);
router.put(
  "/:contactId",
  objectIdValidation,
  updateContactValidation,
  asyncWrapper(updateContactAction)
);
router.patch(
  "/:contactId/favorite",
  objectIdValidation,
  updateStatusContactValidation,
  asyncWrapper(updateStatusContactAction)
);
module.exports = router;

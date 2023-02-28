const express = require("express");

const router = express.Router();

const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts");

const Joi = require("joi");

const contactsSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
});
const favoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: "missing required name field" });
      return;
    }
    const contact = await addContact(req.body);
    return res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const result = await removeContact(req.params.contactId);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: "missing fields" });
      return;
    }
    const result = await updateContact(req.params.contactId, req.body);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  try {
    const { error } = favoriteSchema.validate(req.body);
    if (error) {
      res.status(400).json({ message: "missing field favorite" });
      return;
    }
    const result = await updateStatusContact(req.params.contactId, req.body);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
});
module.exports = router;

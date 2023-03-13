const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../models/contacts");

const getContactsListAction = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    let { page = 1, limit = 20 } = req.query;
    limit = limit > 20 ? 20 : limit;
    const skipAmount = (page - 1) * limit;
    const { favorite } = req.query;

    const contactsList = await listContacts(owner, favorite, {
      skipAmount,
      limit,
    });
    return res.status(200).json({ contactsList, page, limit });
  } catch (error) {
    next(error.message);
  }
};

const getContactByIdAction = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const contactById = await getContactById(req.params.contactId, owner);
    if (!contactById) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    return res.status(200).json(contactById);
  } catch (error) {
    next(error.message);
  }
};

const addContactAction = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const newContact = await addContact(
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        favorite: false,
      },
      owner
    );
    return res.status(201).json(newContact);
  } catch (error) {
    console.log(error.message);
    next(error.message);
  }
};

const removeContactAction = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const contactById = await getContactById(req.params.contactId, owner);

    if (!contactById) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    await removeContact(req.params.contactId);
    return res.status(200).json({ message: "Contact was deleted" });
  } catch (error) {
    next(error.message);
  }
};

const updateContactAction = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const updatedContact = await updateContact(
      req.params.contactId,
      req.body,
      owner
    );
    if (!updatedContact) {
      return res.status(404).json({ message: "Not found" });
    }
    return res.status(200).json({ message: "Contact was updated" });
  } catch (error) {
    next(error.message);
  }
};

const updateStatusContactAction = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const updatedStatusContact = await updateStatusContact(
      req.params.contactId,
      req.body,
      owner
    );
    if (!updatedStatusContact) {
      return res.status(400).json({ message: "Missing field favorite" });
    }
    return res.status(200).json({ message: "Contact was updated" });
  } catch (error) {
    next(error.message);
  }
};

module.exports = {
  getContactsListAction,
  getContactByIdAction,
  addContactAction,
  removeContactAction,
  updateContactAction,
  updateStatusContactAction,
};

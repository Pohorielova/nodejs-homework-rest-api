const { Contact } = require("../db/modelContact");

const listContacts = async () => {
  const result = await Contact.find({});
  return result;
};

const getContactById = async (contactId) => {
  return Contact.findById(contactId);
};

const removeContact = async (contactId) => {
  return Contact.findByIdAndRemove(contactId);
};

const addContact = async (body) => {
  const { name, email, phone, favorite } = body;
  return Contact.create({ name, email, phone, favorite });
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  return Contact.findByIdAndUpdate(contactId, {
    $set: { name, email, phone },
    runValidators: true,
  });
};
const updateStatusContact = async (contactId, body) => {
  const { favorite } = body;
  return Contact.findByIdAndUpdate(contactId, {
    $set: { favorite },
    runValidators: true,
  });
};
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};

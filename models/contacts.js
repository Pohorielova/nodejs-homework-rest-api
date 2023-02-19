const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");
const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  const result = await fs.readFile(contactsPath, "utf8");
  return JSON.parse(result);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = await contacts.find((data) => data.id === contactId);

  return result;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.filter((data) => data.id !== contactId);
  const stringContact = JSON.stringify(contact);

  await fs.writeFile(contactsPath, stringContact, "utf8");
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const contact = {
    id: nanoid(3),
    name: body.name,
    email: body.email,
    phone: body.phone,
  };
  const newData = [];

  newData.push(contact);
  const contactsNew = [...contacts, ...newData];
  const stringContacts = JSON.stringify(contactsNew);
  await fs.writeFile(contactsPath, stringContacts, "utf8");
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const idx = contacts.findIndex((data) => data.id === contactId);
  if (idx === -1) {
    return null;
  }

  contacts[idx] = { ...body, contactId };

  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), "utf8");

  return contacts[idx];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

const { Schema, SchemaTypes, model } = require("mongoose");

const contactSchema = new Schema({
  owner: {
    type: SchemaTypes.ObjectId,
    ref: "user",
  },
  name: {
    type: String,
    minlength: 3,
    maxlength: 30,
    required: [true, "Set name for contact"],
  },
  email: {
    type: String,
    required: true,
    unique: [true, "This email is already in your contact"],
  },
  phone: {
    type: String,
    required: true,
    unique: [true, "This number is already in your contact"],
  },
  favorite: {
    type: Boolean,
    default: false,
  },
});

const Contact = model("contact", contactSchema);

module.exports = { Contact };

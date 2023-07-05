const { Schema, model } = require("mongoose");

const phoneRegexp = /^\(\d{3}\)\s\d{3}-\d{4}$/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "missing required 'name' field"],
    },
    number: {
      type: String,
      match: [phoneRegexp, "invalid phone number, (XXX) XXX-XXXX is required"],
      required: [true, "missing required 'number' field"],
    },
  },
  { versionKey: false }
);

const Contact = model("contact", contactSchema);

module.exports = Contact;

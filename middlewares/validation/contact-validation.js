const Joi = require("joi");

const phoneRegexp = /^\(\d{3}\)\s\d{3}-\d{4}$/;
const fields = ["name", "number"];

const addSchema = Joi.object({
  name: Joi.string().required(),
  number: Joi.string().regex(phoneRegexp).required(),
});

const contactValidation = (req, res, next) => {
  if (!Object.keys(req.body).length) {
    return res.status(400).json({ message: "missing fields" });
  }

  for (const field of fields) {
    if (req.body[field] === undefined)
      return res
        .status(400)
        .json({ message: `missing required "${field}" field` });
  }

  const { error } = addSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};

module.exports = contactValidation;

const { getAll, add } = require("../services/contacts-services");

const ctrlGetAll = async (req, res, next) => {
  const result = await getAll();
  res.json(result);
};

const ctrlAdd = async (req, res, next) => {
  const result = await add(req.body);
  res.status(201).json(result);
};

module.exports = {
  ctrlGetAll,
  ctrlAdd,
};

const User = require("../db/models/user-model");

const addUser = async (data) => {
  const newUser = new User(data);
  await newUser.hashPassword(newUser.password);
  newUser.save();
  return newUser;
};

const findUser = async (data) => {
  const result = await User.findOne(data);
  return result;
};

const updateById = async (id, data) => {
  await User.findByIdAndUpdate(id, data);
};

const update = async (field, data) => {
  await User.findOneAndUpdate(field, data);
};

const checkPassword = async (user, password) => {
  return await user.comparePassword(password);
};

module.exports = {
  addUser,
  findUser,
  updateById,
  update,
  checkPassword,
};

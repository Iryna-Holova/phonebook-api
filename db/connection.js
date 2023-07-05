const mongoose = require("mongoose");

const { DB_HOST } = process.env;

mongoose.set("strictQuery", true);

const mongoConnect = async () => {
  await mongoose.connect(DB_HOST);
};

module.exports = mongoConnect;

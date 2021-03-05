const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../../src/models/user");

const newUserId = new mongoose.Types.ObjectId();
const newUser = {
  _id: newUserId,
  name: "Sara",
  email: "sara@gmail.com",
  role: "superuser",
  password: "!2aA567@",
  tokens: [
    {
      token: jwt.sign({ _id: newUserId }, process.env.JWT_SECRET),
    },
  ],
};

const newUser2Id = new mongoose.Types.ObjectId();
const newUser2 = {
  _id: newUser2Id,
  name: "Msangi",
  email: "msangi@gmail.com",
  password: "!2aA567@",
  active: false,
  tokens: [
    {
      token: jwt.sign({ _id: newUser2Id }, process.env.JWT_SECRET),
    },
  ],
};

const setUpDB = async () => {
  await User.deleteMany();
  await new User(newUser).save();
  await new User(newUser2).save();
};

module.exports = {
  newUserId,
  newUser2,
  newUser,
  setUpDB,
};

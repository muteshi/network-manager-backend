const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Site = require("../../src/models/site");
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
  role: "admin",
  email: "msangi@gmail.com",
  password: "!2aA567@",
  active: false,
  tokens: [
    {
      token: jwt.sign({ _id: newUser2Id }, process.env.JWT_SECRET),
    },
  ],
};

const newUser3Id = new mongoose.Types.ObjectId();
const newUser3 = {
  _id: newUser3Id,
  name: "Msangi",
  role: "admin",
  email: "mami@gmail.com",
  password: "!2aA567@",
  // active: false,
  tokens: [
    {
      token: jwt.sign({ _id: newUser3Id }, process.env.JWT_SECRET),
    },
  ],
};

const newSite1 = {
  _id: new mongoose.Types.ObjectId(),
  name: "Paul Muteshi",
  admin: "muteshi  ",
  ipAddress: "192.168.107.1/24",
  password: "!2A45a",
  owner: newUserId,
};

const newSite2 = {
  _id: new mongoose.Types.ObjectId(),
  name: "Elizabeth Ndii",
  admin: "lizzie  ",
  ipAddress: "192.168.108.1/24",
  password: "!2A45a",
  owner: newUserId,
};
const newSite3 = {
  _id: new mongoose.Types.ObjectId(),
  name: "Sara Msangi",
  admin: "sara  ",
  ipAddress: "192.168.109.1/24",
  password: "!2A45a",
  owner: newUser2Id,
};

const setUpDB = async () => {
  await User.deleteMany();
  await Site.deleteMany();
  await new User(newUser).save();
  await new User(newUser2).save();
  await new User(newUser3).save();
  await new Site(newSite1).save();
  await new Site(newSite2).save();
  await new Site(newSite3).save();
};

module.exports = {
  newUserId,
  newUser2,
  newUser3,
  newUser,
  newSite1,
  newSite2,
  newSite3,
  setUpDB,
};

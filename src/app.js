const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const siteRouter = require("./routers/site");

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(siteRouter);

module.exports = app;

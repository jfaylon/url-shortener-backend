require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const URL = require("url");
const URLModel = require("./models/URL");
const app = express();
const urlRouter = require("./routes/URLRouter")
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", urlRouter)



module.exports = app;

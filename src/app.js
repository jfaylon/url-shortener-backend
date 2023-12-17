require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const urlRouter = require("./routes/URLRouter")
app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/", urlRouter)



module.exports = app;

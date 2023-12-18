require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const specs = require("./swaggerConfig");
const app = express();
const urlRouter = require("./routes/URLRouter");

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use("/", urlRouter);



module.exports = app;

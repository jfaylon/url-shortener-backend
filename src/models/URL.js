const mongoose = require("mongoose");
const URLSchema = require("../schemas/URLSchema");

module.exports = mongoose.model("URL", URLSchema);

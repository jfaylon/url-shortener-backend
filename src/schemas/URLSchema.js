const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
  url: {
    type: "string",
    required: true,
  },
  key: {
    type: "string",
    required: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  lastAccessed: {
    type: Date,
    default: Date.now,
  },
});

URLSchema.index({ key: 1 }, { unique: true });
URLSchema.index({ url: 1 }, { unique: true });

module.exports = URLSchema;

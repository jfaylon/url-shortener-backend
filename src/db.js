const mongoose = require("mongoose")

const CONNECTION_OPTIONS = {
  connectTimeoutMS: 10000,
  maxPoolSize: 40
}

module.exports = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI, CONNECTION_OPTIONS)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
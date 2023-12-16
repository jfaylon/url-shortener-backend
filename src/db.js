const mongoose = require("mongoose")

const CONNECTION_OPTIONS = {
  connectTimeoutMS: 10000,
  maxPoolSize: 40
}

function mongooseConnectionHandler(error, connection) {
  if (error || connection.readyState !== 1) {
    throw new Error("Unable to connect to database")
  }
}

module.exports = async () => {
  try {
    mongoose.createConnection(process.env.MONGO_URI, CONNECTION_OPTIONS, mongooseConnectionHandler)
  } catch (err) {
    console.log(err)
    process.exit(1)
  }
}
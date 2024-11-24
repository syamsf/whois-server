const mongoose = require('mongoose')

const connectDB = async() => {
  try {
    mongoose.set('strictQuery', true)

    const connection = await mongoose.connect(process.env.MONGO_URI)

    console.log(`MongoDB connected: ${connection.connection.host}`.cyan.underline.bold)
  } catch (e) {
    console.error(`Error: ${e.message}`.red)
    // process.exit(1)
  }
}

module.exports = connectDB

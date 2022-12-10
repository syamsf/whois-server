const mongoose = require('mongoose')

const connectDB = async() => {
  // Enable strict query
  mongoose.set('strictQuery', true) 
  
  const connection = await mongoose.connect(process.env.MONGO_URI)

  console.log(`MongoDB connected: ${connection.connection.host}`.cyan.underline.bold)
}

module.exports = connectDB
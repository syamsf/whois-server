const mongoose = require('mongoose')

const WebnicTokenSchema = new mongoose.Schema({
  access_token: {
    type: String,
    trim: true,
    required: [true, 'webnic_access_token is required']
  },
  expires_in: {
    type: Number,
    trim: true,
    required: [true, 'webnic_token_expires_in is required']
  },
  token_type: {
    type: String,
    trim: true,
    required: [true, 'webnic_token_type is required']
  },
  token_expired_time: {
    type: Date,
  },
},
{ timestamps: true })

module.exports = mongoose.model('webnic_token', WebnicTokenSchema, 'webnic_token')
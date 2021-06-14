const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  email: String,
  userType: String,
})

module.exports = model('User', userSchema)

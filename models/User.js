const { model, Schema } = require('mongoose')

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  password: String,
  email: String,
  createdAt: String,
  userType: String,
})

module.exports = model('User', userSchema)

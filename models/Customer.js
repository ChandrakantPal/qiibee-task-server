const { model, Schema } = require('mongoose')

const customerSchema = new Schema({
  email: String,
  firstname: String,
  lastname: String,
  password: String,
  createdAt: String,
  following: [
    {
      brandId: {
        type: Schema.Types.ObjectId,
        ref: 'brands',
      },
      loyaltyPoint: Number,
    },
  ],
  totalloyaltyPoint: Number,
})

module.exports = model('Customer', customerSchema)

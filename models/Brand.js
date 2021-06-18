const { model, Schema } = require('mongoose')

const brandSchema = new Schema({
  email: String,
  brandname: String,
  brandsymbol: String,
  password: String,
  createdAt: String,
  followers: [
    {
      customerId: {
        type: Schema.Types.ObjectId,
        ref: 'customers',
      },
      loyaltyPoint: Number,
      redeemed: Boolean,
    },
  ],
  loyaltyPoint: Number,
})

module.exports = model('Brand', brandSchema)

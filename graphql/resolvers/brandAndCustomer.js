const { AuthenticationError, UserInputError } = require('apollo-server')
const Brand = require('../../models/Brand')
const Customer = require('../../models/Customer')

const checkAuth = require('../../utils/checkAuth')

module.exports = {
  Query: {
    async getBrands() {
      try {
        const brands = await Brand.find().sort({ createdAt: -1 })
        return brands
      } catch (error) {
        throw new Error(error)
      }
    },
    // async getCustomers(_, { customerIds }) {
    //   try {
    //     const ids = []
    //     customerIds.map((customer) => {
    //       ids.push(customer.customerId)
    //     })
    //     const customers = await Customer.find({ _id: { $in: ids } })
    //     return customers
    //   } catch (error) {
    //     throw new Error(error)
    //   }
    // },
  },
  Mutation: {
    async followBrand(_, { brandId, customerId }, context) {
      checkAuth(context)
      try {
        const customer = await Customer.findById(customerId)
        const brand = await Brand.findById(brandId)
        if (customer && brand) {
          customer.following.unshift({
            brandId,
            loyaltyPoint: 0,
          })
          brand.followers.unshift({
            customerId,
            loyaltyPoint: 0,
          })
        }
        await customer.save()
        await brand.save()
        return customer
      } catch (error) {
        throw new Error(error)
      }
    },
    async allocateLoyaltyPoint(_, { points, customerId, brandId }, context) {
      checkAuth(context)
      try {
        const customer = await Customer.findById(customerId)
        const brand = await Brand.findById(brandId)
        if (brand && customer) {
          const followerIndex = brand.followers.findIndex(
            (follower) => follower.customerId == customerId
          )
          if (followerIndex !== -1) {
            if (brand.loyaltyPoint >= points) {
              brand.followers[followerIndex].loyaltyPoint += points
              brand.loyaltyPoint -= points
            } else {
              throw new Error('Not enough points left')
            }
          }
          const followingIndex = customer.following.findIndex(
            (follow) => follow.brandId == brandId
          )
          if (followingIndex !== -1) {
            customer.following[followingIndex].loyaltyPoint += points
          }
        }
        await brand.save()
        await customer.save()
        return brand
      } catch (error) {
        throw new Error(error)
      }
    },
    // async editBrand(_, { brandname, brandsymbol, brandId }, context) {
    //   checkAuth(context)
    //   try {
    //     const brand = await Brand.findById(brandId)
    //     brand.brandname = brandname
    //     brand.brandsymbol = brandsymbol
    //     await brand.save()
    //     return brand
    //   } catch (error) {
    //     throw new Error(error)
    //   }
    // },
  },
}

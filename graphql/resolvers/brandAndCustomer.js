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
    async getCustomers(_, { customerIds }, context) {
      checkAuth(context)
      try {
        const ids = []
        customerIds.map((customer) => {
          ids.push(customer.customerId)
        })
        const customers = await Customer.find({ _id: { $in: ids } })
        return customers
      } catch (error) {
        throw new Error(error)
      }
    },
    async getFollowers(_, { brandId }, context) {
      checkAuth(context)
      try {
        const brand = await Brand.findById(brandId)
        if (brand) {
          const ids = []
          brand.followers.map((customer) => {
            ids.push(customer.customerId)
          })
          const customers = await Customer.find({ _id: { $in: ids } })
          return customers
        } else {
          throw new Error('Brand not found')
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async getFollowing(_, { customerId }, context) {
      checkAuth(context)
      try {
        const customer = await Customer.findById(customerId)
        if (customer) {
          const ids = []
          customer.following.map((brand) => {
            ids.push(brand.brandId)
          })
          const brands = await Brand.find({ _id: { $in: ids } })
          return brands
        } else {
          throw new Error('Customer not found')
        }
      } catch (error) {
        throw new Error(error)
      }
    },
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
            redeemed: false,
          })
          brand.followers.unshift({
            customerId,
            loyaltyPoint: 0,
            redeemed: false,
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
    async redeemPoint(_, { customerId, brandId }, context) {
      checkAuth(context)
      try {
        const customer = await Customer.findById(customerId)
        const brand = await Brand.findById(brandId)

        const followerIndex = brand.followers.findIndex(
          (follower) => follower.customerId == customerId
        )

        if (followerIndex !== -1 && !brand.followers[followerIndex].redeemed) {
          brand.followers[followerIndex].redeemed = true
        }

        const followingIndex = customer.following.findIndex(
          (follow) => follow.brandId == brandId
        )
        if (
          followingIndex !== -1 &&
          !customer.following[followingIndex].redeemed
        ) {
          customer.following[followingIndex].redeemed = true
          customer.totalloyaltyPoint +=
            customer.following[followingIndex].loyaltyPoint
        }
        await brand.save()
        await customer.save()
        return customer
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

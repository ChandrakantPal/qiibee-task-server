const brandAndCustomerResolvers = require('./brandAndCustomer')
const usersResolvers = require('./users')

module.exports = {
  Query: {
    ...brandAndCustomerResolvers.Query,
  },
  Mutation: {
    ...usersResolvers.Mutation,
    ...brandAndCustomerResolvers.Mutation,
  },
}

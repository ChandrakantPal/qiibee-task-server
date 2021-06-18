const { gql } = require('apollo-server')

module.exports = gql`
  type Brand {
    id: ID!
    email: String!
    brandname: String!
    brandsymbol: String!
    createdAt: String!
    followers: [Followers]
    loyaltyPoint: Int!
    token: String
  }
  type Followers {
    customerId: ID!
    loyaltyPoint: Int!
    redeemed: Boolean!
  }
  type Customer {
    id: ID!
    email: String!
    firstname: String!
    lastname: String!
    createdAt: String!
    following: [Following]
    totalloyaltyPoint: Int!
    token: String
  }
  type Following {
    brandId: ID!
    loyaltyPoint: Int!
    redeemed: Boolean!
  }
  type User {
    userType: String!
    brand: Brand
    customer: Customer
  }
  input RegisterInput {
    firstname: String!
    lastname: String!
    password: String!
    email: String!
  }
  input RegisterInputBrand {
    brandname: String!
    brandsymbol: String!
    loyaltyPoint: Int!
    password: String!
    email: String!
  }

  input FollowerId {
    customerId: ID!
    loyaltyPoint: Int!
  }

  type Query {
    getCustomers(customerIds: [FollowerId!]!): [Customer]
    getFollowers(brandId: ID!): [Customer]
    getFollowing(customerId: ID!): [Brand]
    getBrands: [Brand]
    login(email: String!, password: String!): User!
  }
  type Mutation {
    registerCustomer(registerInput: RegisterInput): Customer!
    registerBrand(registerInput: RegisterInputBrand): Brand!
    followBrand(brandId: ID!, customerId: ID!): Customer!
    allocateLoyaltyPoint(points: Int!, brandId: ID!, customerId: ID!): Brand!
    redeemPoint(customerId: ID!, brandId: ID!): Customer!
  }
`

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
  type Query {
    # getCustomers(customerIds: [Followers]): [Customer]
    getBrands: [Brand]
  }
  type Mutation {
    registerCustomer(registerInput: RegisterInput): Customer!
    registerBrand(registerInput: RegisterInputBrand): Brand!
    login(email: String!, password: String!): User!
    followBrand(brandId: ID!, customerId: ID!): Customer!
    allocateLoyaltyPoint(points: Int!, brandId: ID!, customerId: ID!): Brand!
  }
`

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { UserInputError } = require('apollo-server')

const {
  validateRegisterInput,
  validateLoginInput,
  validateBrandRegisterInput,
} = require('../../utils/validators')
const { SECRET_KEY } = require('../../config')
const User = require('../../models/User')
const Customer = require('../../models/Customer')
const Brand = require('../../models/Brand')

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
    },
    SECRET_KEY,
    { expiresIn: '1h' }
  )
}

module.exports = {
  Query: {
    async login(_, { email, password }) {
      const { errors, valid } = validateLoginInput(email, password)
      try {
        // input validation
        if (!valid) {
          throw new UserInputError('Errors', { errors })
        }

        // to find the type of user
        const user = await User.findOne({ email })

        // if email doesn't exist
        if (!user) {
          errors.general = 'User not found'
          throw new UserInputError('User not found', { errors })
        }

        // console.log({ user })

        const returnedUser = {
          userType: user.userType,
        }
        // user type brand
        if (user.userType === 'brand') {
          const brand = await Brand.findOne({ email })
          const match = await bcrypt.compare(password, brand.password)
          if (!match) {
            errors.general = 'Wrong credetials'
            throw new UserInputError('Wrong credetials', { errors })
          }
          // console.log({ brand })
          const token = generateToken(brand)
          returnedUser['brand'] = {
            ...brand._doc,
            id: brand._id,
            token,
          }
        } else if (user.userType === 'customer') {
          // customer user type
          const customer = await Customer.findOne({ email })
          const match = await bcrypt.compare(password, customer.password)
          if (!match) {
            errors.general = 'Wrong credetials'
            throw new UserInputError('Wrong credetials', { errors })
          }
          // console.log({ customer })
          const token = generateToken(customer)
          returnedUser['customer'] = {
            ...customer._doc,
            id: customer._id,
            token,
          }
        }
        // console.log({ returnedUser })
        return returnedUser
      } catch (error) {
        throw new Error(error)
      }
    },
  },
  Mutation: {
    async registerBrand(
      _,
      {
        registerInput: {
          brandname,
          brandsymbol,
          loyaltyPoint,
          password,
          email,
        },
      }
    ) {
      const { valid, errors } = validateBrandRegisterInput(
        brandname,
        brandsymbol,
        loyaltyPoint,
        password,
        email
      )

      try {
        // input validation
        if (!valid) {
          throw new UserInputError('Errors', { errors })
        }

        // check if email alreay exists
        const user = await User.findOne({ email })

        if (user) {
          throw new UserInputError('email is taken', {
            errors: {
              email: 'This email is taken',
            },
          })
        }

        // hash password and creating token
        password = await bcrypt.hash(password, 12)

        // create new brand
        const newBrand = new Brand({
          email,
          brandname,
          brandsymbol,
          password,
          createdAt: new Date().toISOString(),
          followers: [],
          loyaltyPoint,
        })
        const res = await newBrand.save()

        // update the user collection with new brand email
        const newUser = new User({
          email,
          userType: 'brand',
        })

        await newUser.save()

        const token = generateToken(res)

        return {
          ...res._doc,
          id: res._id,
          token,
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async registerCustomer(
      _,
      { registerInput: { firstname, lastname, email, password } }
    ) {
      const { valid, errors } = validateRegisterInput(
        firstname,
        lastname,
        email,
        password
      )
      try {
        // input validation
        if (!valid) {
          throw new UserInputError('Errors', { errors })
        }

        // check if email alreay exists
        const user = await User.findOne({ email })

        if (user) {
          throw new UserInputError('email is taken', {
            errors: {
              email: 'This email is taken',
            },
          })
        }

        // hash password and creating token
        password = await bcrypt.hash(password, 12)

        // create new customer
        const newCustomer = new Customer({
          email,
          firstname,
          lastname,
          password,
          createdAt: new Date().toISOString(),
          following: [],
          totalloyaltyPoint: 0,
        })

        const res = await newCustomer.save()

        // update the user collection with new customer email
        const newUser = new User({
          email,
          userType: 'customer',
        })

        await newUser.save()

        const token = generateToken(res)

        return {
          ...res._doc,
          id: res._id,
          token,
        }
      } catch (error) {
        throw new Error(error)
      }
    },
  },
}

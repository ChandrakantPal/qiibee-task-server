module.exports.validateRegisterInput = (
  firstname,
  lastname,
  email,
  password
) => {
  const errors = {}
  if (firstname.trim() === '') {
    errors.firstname = 'firstname must not be empty'
  }
  if (lastname.trim() === '') {
    errors.lastname = 'lastname must not be empty'
  }
  if (email.trim() === '') {
    errors.email = 'Email must be empty'
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address'
    }
  }
  if (password === '') {
    errors.password = 'Password must not be empty'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validateLoginInput = (email, password) => {
  const errors = {}
  if (email.trim() === '') {
    errors.email = 'email must not be empty'
  }
  if (password === '') {
    errors.password = 'Password must not be empty'
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

module.exports.validateBrandRegisterInput = (
  brandname,
  brandsymbol,
  loyaltyPoint,
  password,
  email
) => {
  const errors = {}
  if (brandname.trim() === '') {
    errors.brandname = 'brandname must not be empty'
  }
  if (brandsymbol.trim() === '') {
    errors.brandsymbol = 'brandsymbol must not be empty'
  }
  if (email.trim() === '') {
    errors.email = 'Email must be empty'
  } else {
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/
    if (!email.match(regEx)) {
      errors.email = 'Email must be a valid email address'
    }
  }
  if (password === '') {
    errors.password = 'Password must not be empty'
  }
  if (loyaltyPoint <= 0) {
    errors.loyaltyPoint = 'loyaltyPoint must be greater than zero'
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  }
}

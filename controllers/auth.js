const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  // passing in the whole request body and allowing mongoose to do the validation
  const user = await User.create({ ...req.body })

  // creates a JWT using mongoose middleware in the User.js schema
  const token = user.createJWT()

  // send the status code 201, create the user, and pass the user info and token
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  // email and password live is the post request body when trying to log in
  const { email, password } = req.body

  // first make sure the user provides both email and password and throw an error if either is missing
  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  // look up the user in the database
  const user = await User.findOne({ email })

  // check if the user exists and if not, throw an error
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  // will only get here if the user exists because "throw" is like a return statement and will stop the function
  // compare the password with middleware created in the User DB model
  // this is checking the two hashed passwords together
  const isPasswordCorrect = await user.comparePassword(password)

  // throw an error if the password does not match.
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  // if the username and password match, create a JWT
  const token = user.createJWT()

  // send a status code of 200 (OK) and provide the user and the token
  res.status(StatusCodes.OK).json({ user: { name: user.name }, token })

}

module.exports = {
  register,
  login,
}
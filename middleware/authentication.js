const User = require('../models/User')
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

// middleware needs next as a parameter so that it can pass it to the next middleware
const auth = async (req, res, next) => {
  // check header
  const authHeader = req.headers.authorization

  // check for the auth header and also make sure it starts with Bearer
  // if either are false, throw the error
  if ( !authHeader || !authHeader.startsWith('Bearer ') ) {
    throw new UnauthenticatedError('Authentication invalid')
  }

  // split the auth header and get the JWT
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // alternative method for getting user info to pass into the request
    // select with a minus sign removes the password from the request
    // const user = User.findById(payload.id).select('-password')
    // req.user = user
    
    // attach the user to the job routes
    // the information from the payload comes from the UserSchema createJWT because we passed the userId and the name
    req.user = { userId: payload.userId, name: payload.name }

    // if everything is successful, pass it on to the next middleware
    next()
    
  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth
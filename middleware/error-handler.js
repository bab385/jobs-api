// const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {
  // create custom error object to handle mongoose errors
  let customError = {
    // set defaults
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong. Try again later.'
  }

  // this was how we originally did this, but the customError is now handling this
  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }

  // ValidationError
  if ( err.name === 'ValidationError' ) {
    // Object.values(err.errors) returns an array that we can iterate over and join
    customError.msg = Object.values(err.errors).map((item) => item.message).join('. ')
    customError.statusCode = 400
  }

  // CastError
  if ( err.name === 'CastError' ) {
    customError.msg = `No item found with id: ${err.value}`
    customError.statusCode = 404
  }
  
  // mongoose err.code = 11000 for a duplicate value where it must be unique. In this case, for the user's email address
  // because we set up unique: true on the email for a user
  if ( err.code && err.code === 11000 ) {
    customError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field. Please choose another value.`
    customError.statusCode = 400
  }
  
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleware

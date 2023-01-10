const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length })
}

const getJob = async (req, res) => {
  const { 
    user: { userId }, 
    params: { id: jobId }, 
  } = req

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId
  })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const createJob = async (req, res) => {
  // find the user from req.user and add it to the body for submission to the DB
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({ job })
}

const updateJob = async (req, res) => {
  const { 
    body: { company, position },
    user: { userId }, 
    params: { id: jobId }, 
  } = req

  if ( company === '' || position === '' ) {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }

  // mongoose takes 3 variables
  const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}

const deleteJob = async (req, res) => {
  const { 
    user: { userId }, 
    params: { id: jobId }, 
  } = req

  const job = await Job.findByIdAndRemove({
    _id: jobId,
    createdBy: userId
  })
  
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
}
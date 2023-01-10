const mongoose = require('mongoose')

const JobSchema = new mongoose.Schema({
  company: {
    type: String,
    required: [true, 'Please provide company name'],
    maxlength: 50
  },
  position: {
    type: String,
    required: [true, 'Please provide position'],
    maxlength: 100
  },
  status: {
    type: String,
    enum: ['interview', 'declined', 'pending'],
    default: 'pending'
  },
  createdBy: {
    // this is how you associate a job with a user and make sure the user is the only one that can see, edit, or delete the job
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please provide user']
  }
}, {timestamps: true})

module.exports = mongoose.model('Job', JobSchema)
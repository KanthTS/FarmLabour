const exp = require('express')
const handler = require('express-async-handler')
const userModel = require('../Models/farmerModel')
const jobModel = require('../Models/jobModel')
const applicationModel = require('../Models/applicationModel')

const publicApp = exp.Router()

publicApp.get(
  '/stats',
  handler(async (req, res) => {
    const [farmers, labourers, jobsPosted, successfulHirings, totalApplications] =
      await Promise.all([
        userModel.countDocuments({ role: 'farmer' }),
        userModel.countDocuments({ role: 'labour' }),
        jobModel.countDocuments(),
        applicationModel.countDocuments({ status: 'hired' }),
        applicationModel.countDocuments(),
      ])

    const successRate =
      totalApplications > 0
        ? Math.round((successfulHirings / totalApplications) * 100)
        : 0

    res.send({
      message: 'stats',
      payload: {
        farmers,
        labourers,
        jobsPosted,
        successfulHirings,
        successRate,
      },
    })
  })
)

module.exports = publicApp

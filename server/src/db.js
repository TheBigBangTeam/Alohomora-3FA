const mongoose = require('mongoose')

const dbConnect = async () => {
  mongoose.Promise = global.Promise
  try {
    await mongoose.connect(process.env.MONGODB_URI)
  } catch (e) {
    throw new Error('******** ERROR: Could not connect to mongodb ********')
  }
}

module.exports = {dbConnect}

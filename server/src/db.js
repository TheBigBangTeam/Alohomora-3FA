const mongoose = require('mongoose')
const config = require('config')

const dbConnect = async () => {
  mongoose.Promise = global.Promise
  try {
    await mongoose.connect(config.get('Settings.db'))
  } catch (e) {
    throw new Error('******** ERROR: Could not connect to mongodb ********')
  }
}

module.exports = {dbConnect}


const {dbConnect} = require('./../db')

describe('[*] DB CONNECTION TEST', () => {
  it('should connect to database successfully', (done) => {
    try {
      dbConnect()
      done()
    } catch (e) {
      done(e.message)
    };
  })

  it('should NOT connect to a non-existent database', (done) => {
    process.env.MONGODB_URI = 'mongodb://NotLocalhost/alohomora'
    dbConnect()
        .then(() => done('Should not have connected'))
        .catch(() => done())
  })
})

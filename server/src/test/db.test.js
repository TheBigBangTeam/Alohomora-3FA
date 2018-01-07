
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
})

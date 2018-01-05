'use strict'

module.exports = (req, res, next) => {
  let urlAux = req.originalUrl.split('/') // Splits originating url route and saves first level.
  if (urlAux[1] === 'api') return res.sendStatus(400) // Checks if the first level is /api
  next() // otherwise it must be a angular route and it should be handled by frontend
}

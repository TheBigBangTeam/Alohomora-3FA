
var User = require('./../models/User');


/* MIDDLEWARE FOR AUTHENTICATION */
var authenticate = (req, res ,next) => {
    var token = req.header('x-auth');
  
      User.findByToken(token)
      .then((user) => {
          if(!user) {
              return res.sendStatus(401);
          }
  
          req.user = user;
          req.token = token;
          next();
      })
      .catch((e) => {
          return res.sendStatus(401);
      });
};

module.exports = {authenticate};
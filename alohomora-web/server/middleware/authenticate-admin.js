var User = require('./../models/User');

var authenticate = (req, res , next) => {
    var token = req.header('x-auth');
      User.findByToken(token)
      .then((user) => {
          if(!user) {
              return res.sendStatus(401);
          }
          if(user.isAdmin()){ return next(); }
          
          return Promise.reject();
          
      })
      .catch((e) => {
          return res.sendStatus(401);
      });
  };

module.exports = {authenticate};
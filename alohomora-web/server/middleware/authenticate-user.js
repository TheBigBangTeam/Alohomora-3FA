"use strict";

const User = require('./../models/User');


/* MIDDLEWARE FOR AUTHENTICATION */
const authenticate = (req, res ,next) => {
    let token = req.header('x-auth');
  
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
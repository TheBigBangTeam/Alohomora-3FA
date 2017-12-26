"use strict";

const User = require('./../models/User');

const authenticate = (req, res , next) => {
    let token = req.header('x-auth');
      User.findByToken(token)
      .then((user) => {
          if(!user) {
              return res.sendStatus(401);
          }

          if(user.isAdmin()){
              req.user = user;
              req.token = token;
              return next(); 
          }
          
          return Promise.reject();
          
      })
      .catch((e) => {
          return res.sendStatus(401);
      });
  };

module.exports = {authenticate};
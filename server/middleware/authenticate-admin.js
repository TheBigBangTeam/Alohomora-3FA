"use strict";

const User = require('./../models/User');

/* MIDDLEWARE FOR AUTHENTICATION */
const authenticate = async (req, res , next) => {

    try {
        const user = await User.findByToken(req.token);
        if(!user) {
            return res.sendStatus(401);
        }

        if(user.isAdmin()){
            req.user = user;
            return next(); 
        }

        throw new Error(`Not authorized`);
        
    } catch (error) {
        return res.sendStatus(401);
    }
    
  };

module.exports = {authenticate};
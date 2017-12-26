"use strict";

const User = require('./../models/User');

const authenticate = async (req, res , next) => {
    const token = req.header('x-auth');

    try {
        const user = await User.findByToken(token);
        if(!user) {
            return res.sendStatus(401);
        }

        if(user.isAdmin()){
            req.user = user;
            req.token = token;
            return next(); 
        }

        throw new Error(`Not authorized`);
        
    } catch (error) {
        return res.sendStatus(401);
    }
    
  };

module.exports = {authenticate};
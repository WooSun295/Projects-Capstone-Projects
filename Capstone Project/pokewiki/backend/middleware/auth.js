"use strict";

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { UnauthorizedError } = require("../expressError");

const authenticateJWT = (req, res, next) => {
   try {
      const token = req.body._token;
      if (token) {
         res.locals.user = jwt.verify(token, SECRET_KEY);
         console.log(`Token: ${token}, Username: ${res.locals.user.username}`);
      }
      return next();
   } catch (err) {
      return next();
   }
};

const ensureLoggedIn = (req, res, next) => {
   try {
      if (!res.locals.user) throw new UnauthorizedError();
      const { username } = res.locals.user;
      if (req.params.username) {
         if (req.params.username === username) return next();
         else throw new UnauthorizedError();
      }
   } catch (err) {
      return next(err);
   }
};

module.exports = {
   authenticateJWT,
   ensureLoggedIn,
};

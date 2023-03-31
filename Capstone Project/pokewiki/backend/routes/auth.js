"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");
const userAuthSchema = require("../schemas/userAuth.json");
const userRegisterSchema = require("../schemas/userRegister.json");

const router = new express.Router();

router.post("/login", async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, userAuthSchema);
      if (!validator.valid) {
         const errs = validator.errors.map((e) => e.stack);
         throw new BadRequestError(errs);
      }

      const { username, password } = req.body;
      const user = await User.authenticate(username, password);
      const _token = createToken(user);
      return res.json({ _token });
   } catch (err) {
      return next(err);
   }
});

router.post("/signup", async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, userRegisterSchema);
      console.log(validator);
      if (!validator.valid) {
         const errs = validator.errors.map((e) => e.stack);
         throw new BadRequestError(errs);
      }

      const newUser = await User.register({ ...req.body });
      const _token = createToken(newUser);
      return res.status(201).json({ _token });
   } catch (err) {
      return next(err);
   }
});

module.exports = router;

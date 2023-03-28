"use strict";

/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const User = require("../models/user");
const userUpdateSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, pfpUrl }
 *
 * Authorization required: login
 **/

router.get("/:username", ensureLoggedIn, async function (req, res, next) {
   try {
      const user = await User.get(req.params.username);
      return res.json({ user });
   } catch (err) {
      return next(err);
   }
});

/** POST /[username]/favs/[id] => {added: [id]}
 *
 * Returns {added: id}
 *
 * Authorization required: login
 * **/

router.post("/:username/favs/:id", ensureLoggedIn, async function (req, res, next) {
   try {
      const { username, id } = req.params;
      const added = await User.addFav(username, id);
      return res.json({ added });
   } catch (err) {
      return next(err);
   }
});

router.get("/:username/favs/", ensureLoggedIn, async function (req, res, next) {
   try {
      const { username } = req.params;
      const favorites = await User.getAllFav(username);
      return res.json({ username, favorites });
   } catch (err) {
      return next(err);
   }
});

router.delete("/:username/favs/:id", ensureLoggedIn, async function (req, res, next) {
   try {
      const { username, id } = req.params;
      await User.removeFav(username, id);
      return res.json({ deleted: id });
   } catch (err) {
      return next(err);
   }
});

/** PATCH /[username] { user } => { user }
 *
 * Data can include:
 *   { firstName, lastName, password, email, pfpUrl }
 *
 * Returns { username, firstName, lastName, email, pfpUrl }
 *
 * Authorization required: login
 **/

router.patch("/:username", ensureLoggedIn, async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, userUpdateSchema);
      if (!validator.valid) {
         const errs = validator.errors.map((e) => e.stack);
         throw new BadRequestError(errs);
      }

      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
   } catch (err) {
      return next(err);
   }
});

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization required: login
 **/

router.delete("/:username", ensureLoggedIn, async function (req, res, next) {
   try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
   } catch (err) {
      return next(err);
   }
});

module.exports = router;

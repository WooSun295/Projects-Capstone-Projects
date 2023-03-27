"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Pokewiki = require("../models/pokewiki");

const router = new express.Router();

/** GET /  =>
 *   { pokemons: [ { id, name, sprites }, ...] }
 *
 *
 *   Authorization required: none
 */

router.get("/", async function (req, res, next) {
   try {
      const pokemons = await Pokewiki.getAll();

      console.log(await pokemons);

      return res.json({ pokemons });
   } catch (err) {
      return next(err);
   }
});

/** GET /[handle]  =>  { company }
 *
 *  Company is { handle, name, description, numEmployees, logoUrl, jobs }
 *   where jobs is [{ id, title, salary, equity }, ...]
 *
 * Authorization required: none
 */

router.get("/:handle", async function (req, res, next) {
   try {
      const company = await Company.get(req.params.handle);
      return res.json({ company });
   } catch (err) {
      return next(err);
   }
});

/** PATCH /[handle] { fld1, fld2, ... } => { company }
 *
 * Patches company data.
 *
 * fields can be: { name, description, numEmployees, logo_url }
 *
 * Returns { handle, name, description, numEmployees, logo_url }
 *
 * Authorization required: login
 */

router.patch("/:handle", ensureLoggedIn, async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, companyUpdateSchema);
      if (!validator.valid) {
         const errs = validator.errors.map((e) => e.stack);
         throw new BadRequestError(errs);
      }

      const company = await Company.update(req.params.handle, req.body);
      return res.json({ company });
   } catch (err) {
      return next(err);
   }
});

/** DELETE /[handle]  =>  { deleted: handle }
 *
 * Authorization: login
 */

router.delete("/:handle", ensureLoggedIn, async function (req, res, next) {
   try {
      await Company.remove(req.params.handle);
      return res.json({ deleted: req.params.handle });
   } catch (err) {
      return next(err);
   }
});

module.exports = router;

"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError, NotFoundError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Pokewiki = require("../models/pokewiki");
const pluralize = require("../helpers/pluralize");

const router = new express.Router();

/** GET /[category]  =>
 *
 * if category is pokemon
 *   { pokemons: [ { id, name, imgUrl }, ...] }
 *
 * if category is ability
 *   { abilities: [ { id, name }, ...] }
 *
 * if category is berry
 *   { berries: [ { id, name }, ...] }
 *
 * if category is item
 *   { items: [ { id, name, imgUrl }, ...] }
 *
 *   Authorization required: none
 */

router.get("/:category", async function (req, res, next) {
   try {
      const { category } = req.params;

      if (!["pokemon", "ability", "berry", "item"].includes(category)) next();

      const result = await Pokewiki.getAll(category);

      return res.json({ [pluralize(category)]: result });
   } catch (err) {
      return next(err);
   }
});

/** GET /[category]/[id]  =>  { category }
 *
 *  category is { whole object from PokeApi }
 *
 * Authorization required: none
 */

router.get("/:category/:id", async function (req, res, next) {
   try {
      const { category, id } = req.params;

      if (!["pokemon", "ability", "berry", "item"].includes(category)) next();

      const result = await Pokewiki.get(category, id);

      return res.json({ [category]: result });
   } catch (err) {
      return next(err);
   }
});

module.exports = router;

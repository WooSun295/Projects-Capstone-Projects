"use strict";

const axios = require("axios");
const { BadRequestError } = require("../expressError");
const capitalize = require("../helpers/capitalize");

const BASE_URL = "https://pokeapi.co/api/v2";

/** Related functions for companies. */

class Pokewiki {
   /** Get all pokemons.
    *
    * Returns [{ id, name, imgUrl }, ...]
    * */

   static async getAll(category) {
      const apiRes = await axios.get(`${BASE_URL}/${category}?limit=1008&offset=0`);

      const results = await Promise.all(
         apiRes.data.results.map(async (data) => {
            let result = await axios.get(data.url);
            let { id, name, sprites } = result.data;

            if (category === "pokemon")
               return { id, name: capitalize(name), imgUrl: sprites.front_default };
            else if (category === "item")
               return { id, name: capitalize(name), imgUrl: sprites.default };
            else if (category === "berry") {
               let resultImg = await axios.get(result.data.item.url);
               return {
                  id,
                  name: capitalize(name),
                  imgUrl: resultImg.data.sprites.default,
               };
            } else return { id, name: capitalize(name) };
         })
      );

      return results;
   }

   /** Given a category and id, return data about the category.
    *
    * Returns { whole obj from PokeApi }
    *
    * Throws NotFoundError if not found.
    **/

   static async get(category, id, isFav) {
      try {
         const result = await axios.get(`${BASE_URL}/${category}/${id}/`);
         if (isFav) {
            let { id, name, sprites } = result.data;
            return { id, name: capitalize(name), imgUrl: sprites.front_default };
         }
         return result.data;
      } catch (err) {
         throw new BadRequestError(`No ${category} with id of ${id}`);
      }
   }
}

module.exports = Pokewiki;

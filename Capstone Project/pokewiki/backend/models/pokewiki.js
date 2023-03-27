"use strict";

const axios = require("axios");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const capitalize = require("../helpers/capitalize");

const BASE_URL = "https://pokeapi.co/api/v2";

/** Related functions for companies. */

class Pokewiki {
   /** Get all pokemons.
    *
    * Returns [{ id, name, imgUrl }, ...]
    * */

   static async getAll() {
      const apiRes = await axios.get(`${BASE_URL}/pokemon?limit=100000&offset=0`);

      const pokemons = await apiRes.data.results.map(async (pkmn) => {
         let pkmnRes = await axios.get(pkmn.url);
         let { id, name, sprites } = pkmnRes.data;

         return { id, name: capitalize(name), imgUrl: sprites.front_default };
      });

      return pokemons;
   }

   static async filterBy(filter) {
      const companiesRes = await db.query(
         `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           WHERE ${filter}
           ORDER BY name`
      );
      return companiesRes.rows;
   }

   /** Given a company handle, return data about company.
    *
    * Returns { handle, name, description, numEmployees, logoUrl, jobs }
    *   where jobs is [{ id, title, salary, equity, companyHandle }, ...]
    *
    * Throws NotFoundError if not found.
    **/

   static async get(handle) {
      const companyRes = await db.query(
         `SELECT handle,
                  name,
                  description,
                  num_employees AS "numEmployees",
                  logo_url AS "logoUrl"
           FROM companies
           WHERE handle = $1`,
         [handle]
      );

      const jobRes = await db.query(
         `SELECT id, title, salary, equity
         FROM jobs
         WHERE company_handle = $1
         ORDER BY title`,
         [handle]
      );

      const company = companyRes.rows[0];
      const jobs = jobRes.rows;

      if (!company) throw new NotFoundError(`No company: ${handle}`);
      if (!jobs[0]) return company;

      return { ...company, jobs };
   }

   /** Update company data with `data`.
    *
    * This is a "partial update" --- it's fine if data doesn't contain all the
    * fields; this only changes provided ones.
    *
    * Data can include: {name, description, numEmployees, logoUrl}
    *
    * Returns {handle, name, description, numEmployees, logoUrl}
    *
    * Throws NotFoundError if not found.
    */

   static async update(handle, data) {
      const { setCols, values } = sqlForPartialUpdate(data, {
         numEmployees: "num_employees",
         logoUrl: "logo_url",
      });
      const handleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE companies 
                      SET ${setCols} 
                      WHERE handle = ${handleVarIdx} 
                      RETURNING handle, 
                                name, 
                                description, 
                                num_employees AS "numEmployees", 
                                logo_url AS "logoUrl"`;
      const result = await db.query(querySql, [...values, handle]);
      const company = result.rows[0];

      if (!company) throw new NotFoundError(`No company: ${handle}`);

      return company;
   }

   /** Delete given company from database; returns undefined.
    *
    * Throws NotFoundError if company not found.
    **/

   static async remove(handle) {
      const result = await db.query(
         `DELETE
           FROM companies
           WHERE handle = $1
           RETURNING handle`,
         [handle]
      );
      const company = result.rows[0];

      if (!company) throw new NotFoundError(`No company: ${handle}`);
   }
}

module.exports = Pokewiki;

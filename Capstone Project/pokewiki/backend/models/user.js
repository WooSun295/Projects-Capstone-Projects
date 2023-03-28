"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
   NotFoundError,
   BadRequestError,
   UnauthorizedError,
   ServerDownError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");
const Pokewiki = require("./pokewiki");

/** Related functions for users. */

class User {
   /** authenticate user with username, password.
    *
    * Returns { username, first_name, last_name, email}
    *
    * Throws UnauthorizedError is user not found or wrong password.
    **/

   static async authenticate(username, password) {
      // try to find the user first
      const result = await db.query(
         `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  pfp_url AS "pfpUrl"
           FROM users
           WHERE username = $1`,
         [username]
      );

      const user = result.rows[0];

      if (user) {
         // compare hashed password to a new hash from password
         const isValid = await bcrypt.compare(password, user.password);
         if (isValid === true) {
            delete user.password;
            return user;
         }
      }

      throw new UnauthorizedError("Invalid username/password");
   }

   /** Register user with data.
    *
    * Returns { username, firstName, lastName, email}
    *
    * Throws BadRequestError on duplicates.
    **/

   static async register({ username, password, firstName, lastName, email, pfpUrl }) {
      const duplicateCheck = await db.query(
         `SELECT username
           FROM users
           WHERE username = $1`,
         [username]
      );

      if (duplicateCheck.rows[0]) {
         throw new BadRequestError(`Duplicate username: ${username}`);
      }

      const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

      const result = await db.query(
         `INSERT INTO users
           (username,
            password,
            first_name,
            last_name,
            email,
            pfp_url)
           VALUES ($1, $2, $3, $4, $5)
           RETURNING username, first_name AS "firstName", last_name AS "lastName", email, pfp_url AS "pfpUrl"`,
         [username, hashedPassword, firstName, lastName, email, pfpUrl]
      );

      const user = result.rows[0];

      return user;
   }

   /** Add user and pokemon name to fav
    *
    * Returns {added: pkmn}
    *
    * throws BadRequestError on duplicates
    * **/

   static async addFav(username, id) {
      const userRes = await db.query(
         `SELECT username
        FROM users
        WHERE username = $1`,
         [username]
      );

      const user = userRes.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      const duplicateCheck = await db.query(
         `SELECT user_id, pkmn_id
       FROM favorites
       WHERE user_id = $1 AND pkmn_id = $2`,
         [username, id]
      );

      if (duplicateCheck.rows[0]) {
         throw new BadRequestError(`Duplicate application`);
      }
      const favRes = await db.query(
         `INSERT INTO favorites (user_id, pkmn_id)
        VALUES ($1, $2)
        RETURNING user_id`,
         [username, id]
      );

      if (!favRes) throw new ServerDownError();

      return id;
   }

   static async getAllFav(username) {
      const userRes = await db.query(
         `SELECT username
         FROM users
         WHERE username = $1`,
         [username]
      );

      const user = userRes.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      const favsRes = await db.query(
         `SELECT pkmn_id
         FROM favorites
         WHERE user_id = $1`,
         [user.username]
      );

      const favs = await Promise.all(
         favsRes.rows.map(async (id) => {
            return Pokewiki.get("pokemon", id.pkmn_id, true);
         })
      );

      return favs;
   }

   static async removeFav(username, id) {
      const userRes = await db.query(
         `SELECT username
        FROM users
        WHERE username = $1`,
         [username]
      );

      const user = userRes.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      const result = await db.query(
         `DELETE 
            FROM favorites
            WHERE user_id = $1 AND pkmn_id = $2
            RETURNING user_id`,
         [username, id]
      );

      const fav = result.rows[0];

      if (!fav) throw new NotFoundError(`No favorited pokemon of id ${id}`);

      return id;
   }

   /** Given a username, return data about user.
    *
    * Returns { username, first_name, last_name, email, pkmns }
    *   where pkmns is [{id, name, sprites}, {id, ...}]
    *
    * Throws NotFoundError if user not found.
    **/

   static async get(username) {
      const userRes = await db.query(
         `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  pfp_url AS "pfpUrl"
           FROM users
           WHERE username = $1`,
         [username]
      );

      const user = userRes.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      const favRes = await db.query(
         `SELECT pkmn_id
          FROM favorites
          WHERE user_id = $1`,
         [user.username]
      );

      let pkmns = favRes.rows.map((obj) => {
         return obj.pkmn;
      });

      user.favs = pkmns;

      return user;
   }

   /** Update user data with `data`.
    *
    * This is a "partial update" --- it's fine if data doesn't contain
    * all the fields; this only changes provided ones.
    *
    * Data can include:
    *   { firstName, lastName, password, email }
    *
    * Returns { username, firstName, lastName, email }
    *
    * Throws NotFoundError if not found.
    *
    * WARNING: this function can set a new password.
    * Callers of this function must be certain they have validated inputs to this
    * or a serious security risks are opened.
    */

   static async update(username, data) {
      if (data.password) {
         data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
      }

      const { setCols, values } = sqlForPartialUpdate(data, {
         firstName: "first_name",
         lastName: "last_name",
         email: "email",
         pfpUrl: "pfp_url",
      });
      const usernameVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                pfp_url AS "pfpUrl"`;
      const result = await db.query(querySql, [...values, username]);
      const user = result.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);

      delete user.password;
      return user;
   }

   /** Delete given user from database; returns undefined. */

   static async remove(username) {
      let result = await db.query(
         `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
         [username]
      );
      const user = result.rows[0];

      if (!user) throw new NotFoundError(`No user: ${username}`);
   }
}

module.exports = User;

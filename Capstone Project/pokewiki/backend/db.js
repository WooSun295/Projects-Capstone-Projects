"use strict";
/** Database setup for jobly. */
const { Client } = require("pg");

let db;

db = new Client({
   connectionString: "pokewiki",
   // ssl: {
   //    rejectUnauthorized: false,
   // },
});

db.connect();

module.exports = db;

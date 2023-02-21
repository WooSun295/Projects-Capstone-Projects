"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {
   static async create({ title, salary, equity, company_handle }) {
      const result = await db.query(
         `INSERT INTO jobs (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING title, salary, equity, company_handle`,
         [title, salary, equity, company_handle]
      );
      const job = result.rows[0];

      return job;
   }

   static async findAll() {
      const jobsRes = await db.query(
         `SELECT title,
                salary,
                equity,
                company_handle AS "company"
            FROM jobs
            ORDER BY title`
      );
      return jobsRes.rows;
   }

   static async get(title) {
      const jobRes = await db.query(
         `SELECT title,
                salary,
                equity,
                company_handle AS "company"
            FROM jobs
            WHERE title = $1`,
         [title]
      );

      const job = jobRes.rows[0];

      if (!job) throw new NotFoundError(`No job: ${title}`);

      return job;
   }

   static async update(title, data) {
      const { setCols, values } = sqlForPartialUpdate(data, {
         title: "title",
         salary: "salary",
         equity: "equity",
      });
      const titleVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE jobs
                        SET ${setCols}
                        WHERE title = ${titleVarIdx}
                        RETURNING title,
                                salary,
                                equity,
                                company_handle AS "company"`;
      const result = await db.query(querySql, [...values, title]);
      const job = result.rows[0];

      if (!job) throw new NotFoundError(`No job: ${title}`);

      return job;
   }

   static async remove(title) {
      const result = await db.query(
         `DELETE
            FROM jobs
            WHERE title = $1
            RETURNING title`,
         [title]
      );
      const job = result.rows[0];

      if (!job) throw new NotFoundError(`No job: ${title}`);
   }
}

module.exports = Job;

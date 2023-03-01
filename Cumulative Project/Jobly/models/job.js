"use strict";

const db = require("../db");
const { NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Job {
   static async create({ title, salary, equity, company_handle }) {
      const result = await db.query(
         `INSERT INTO jobs (title, salary, equity, company_handle)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, salary, equity, company_handle`,
         [title, salary, equity, company_handle]
      );
      const job = result.rows[0];

      return job;
   }

   static async findAll() {
      const jobsRes = await db.query(
         `SELECT id,
                title,
                salary,
                equity,
                company_handle AS "company"
            FROM jobs
            ORDER BY title`
      );
      return jobsRes.rows;
   }

   static async filterBy(filter) {
      const jobsRes = await db.query(
         `SELECT id,
                title,
                salary,
                equity,
                company_handle AS "company"
         FROM jobs
         WHERE ${filter}
         ORDER BY title`
      );
      return jobsRes.rows;
   }

   static async get(id) {
      const jobRes = await db.query(
         `SELECT id, 
                title,
                salary,
                equity,
                company_handle AS "company"
            FROM jobs
            WHERE id = $1`,
         [id]
      );

      const job = jobRes.rows[0];

      if (!job) throw new NotFoundError(`No job: ${id}`);

      return job;
   }

   static async update(id, data) {
      const { setCols, values } = sqlForPartialUpdate(data, {
         title: "title",
         salary: "salary",
         equity: "equity",
      });
      const idVarIdx = "$" + (values.length + 1);

      const querySql = `UPDATE jobs
                        SET ${setCols}
                        WHERE id = ${idVarIdx}
                        RETURNING id,
                                title,
                                salary,
                                equity,
                                company_handle AS "company"`;
      const result = await db.query(querySql, [...values, id]);
      const job = result.rows[0];

      if (!job) throw new NotFoundError(`No job: ${id}`);

      return job;
   }

   static async remove(id) {
      const result = await db.query(
         `DELETE
            FROM jobs
            WHERE id = $1
            RETURNING title`,
         [id]
      );
      const job = result.rows[0];

      if (!job) throw new NotFoundError(`No job: ${id}`);
   }
}

module.exports = Job;

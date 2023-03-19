"use strict";

/** Routes for companies. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureLoggedIn } = require("../middleware/auth");
const Job = require("../models/job");
const { jobFilter } = require("../helpers/sql");

const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");

const router = new express.Router();

/** POST / { job } =>  { job }
 *
 * job should be { id, title, salary, equity, company_handle }
 *
 * Returns { id, title, salary, equity, company_handle }
 *
 * Authorization required: login/admin
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, jobNewSchema);
      if (!validator.valid) {
         const errs = validator.errors.map((e) => e.stack);
         throw new BadRequestError(errs);
      }

      const job = await Job.create(req.body);
      return res.status(201).json({ job });
   } catch (err) {
      return next(err);
   }
});

/** GET /  =>
 *   { jobs: [ { id, title, salary, equity, company_handle }, ...] }
 *
 * Can filter on provided search filters:
 * - title
 * - minSalary
 * - hasEquity (if true, filter to jobs that provide a non-zero amount of equity, if false or not included, list all jobs regardless of equity)
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
   try {
      const { title, minSalary, hasEquity } = req.query;
      if (Number(minSalary) < 0) throw new BadRequestError();

      const filter = jobFilter(title, minSalary, hasEquity);

      let jobs;
      if (filter === "") jobs = await Job.findAll();
      else jobs = await Job.filterBy(filter);

      return res.json({ jobs });
   } catch (err) {
      return next(err);
   }
});

/** GET /[id]  =>  { job }
 *
 *  Job is { id, title, salary, equity, company_handle }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
   try {
      const job = await Job.get(req.params.id);
      return res.json({ job });
   } catch (err) {
      return next(err);
   }
});

/** PATCH /[id] { fld1, fld2, ... } => { job }
 *
 * Patches job data.
 *
 * fields can be: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, company_handle }
 *
 * Authorization required: login/admin
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
   try {
      const validator = jsonschema.validate(req.body, jobUpdateSchema);
      if (!validator.valid) {
         const errs = validator.errors.map((e) => e.stack);
         throw new BadRequestError(errs);
      }

      const job = await Job.update(req.params.id, req.body);
      return res.json({ job });
   } catch (err) {
      return next(err);
   }
});

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: login/admin
 */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
   try {
      await Job.remove(req.params.id);
      return res.json({ deleted: req.params.id });
   } catch (err) {
      return next(err);
   }
});

module.exports = router;

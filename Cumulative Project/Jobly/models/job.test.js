"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
   commonBeforeAll,
   commonBeforeEach,
   commonAfterEach,
   commonAfterAll,
} = require("./_testCommon");
let job1, job2, job3;

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

beforeAll(async () => {
   const idsDb = await db.query(
      `SELECT id
      FROM jobs`
   );
   [job1, job2, job3] = idsDb.rows;
});

/************************************** create */

describe("create", function () {
   const newJob = {
      title: "new",
      salary: 1234,
      equity: "0.987",
      company_handle: "c1",
   };

   test("works", async function () {
      let job = await Job.create(newJob);
      expect(job).toEqual({ ...newJob, id: job.id });

      const result = await db.query(
         `SELECT id, title, salary, equity, company_handle AS "company"
           FROM jobs
           WHERE title = 'new'`
      );
      expect(result.rows).toEqual([
         {
            id: job.id,
            title: "new",
            salary: 1234,
            equity: "0.987",
            company: "c1",
         },
      ]);
   });
});

/************************************** findAll */

describe("findAll", function () {
   test("works: no filter", async function () {
      let jobs = await Job.findAll();
      expect(jobs).toEqual([
         {
            id: job1.id,
            title: "j1",
            salary: 1,
            equity: "0.1",
            company: "c1",
         },
         {
            id: job2.id,
            title: "j2",
            salary: 2,
            equity: "0.0",
            company: "c3",
         },
         {
            id: job3.id,
            title: "j3",
            salary: 3,
            equity: "0.3",
            company: "c3",
         },
      ]);
   });
});

// /************************************** get */

describe("get", function () {
   test("works", async function () {
      let job = await Job.get(job1.id);
      expect(job).toEqual({
         id: job1.id,
         title: "j1",
         salary: 1,
         equity: "0.1",
         company: "c1",
      });
   });

   test("not found if no such job", async function () {
      try {
         await Job.get(-1);
         fail();
      } catch (err) {
         expect(err instanceof NotFoundError).toBeTruthy();
      }
   });
});

// /************************************** update */

describe("update", function () {
   const updateData = {
      title: "New",
      salary: 12,
      equity: "0.12",
   };

   test("works", async function () {
      let job = await Job.update(job1.id, updateData);
      expect(job).toEqual({
         id: job1.id,
         company: "c1",
         ...updateData,
      });

      const result = await db.query(
         `SELECT id, title, salary, equity, company_handle AS "company"
           FROM jobs
           WHERE id = $1`,
         [job1.id]
      );
      expect(result.rows).toEqual([
         {
            id: job1.id,
            title: "New",
            salary: 12,
            equity: "0.12",
            company: "c1",
         },
      ]);
   });

   test("works: null fields", async function () {
      const updateDataSetNulls = {
         title: "New",
         salary: null,
         equity: null,
      };

      let job = await Job.update(job1.id, updateDataSetNulls);
      expect(job).toEqual({
         id: job1.id,
         company: "c1",
         ...updateDataSetNulls,
      });

      const result = await db.query(
         `SELECT title, salary, equity, company_handle AS "company"
          FROM jobs
          WHERE id = ${job1.id}`
      );
      expect(result.rows).toEqual([
         {
            title: "New",
            salary: null,
            equity: null,
            company: "c1",
         },
      ]);
   });

   test("not found if no such job", async function () {
      try {
         await Job.update(-1, updateData);
         fail();
      } catch (err) {
         expect(err instanceof NotFoundError).toBeTruthy();
      }
   });

   test("bad request with no data", async function () {
      try {
         await Job.update(job1.id, {});
         fail();
      } catch (err) {
         expect(err instanceof BadRequestError).toBeTruthy();
      }
   });
});

// /************************************** remove */

describe("remove", function () {
   test("works", async function () {
      await Job.remove(job1.id);
      const res = await db.query("SELECT id FROM jobs WHERE id=$1", [job1.id]);
      expect(res.rows.length).toEqual(0);
   });

   test("not found if no such job", async function () {
      try {
         await Job.remove(-1);
         fail();
      } catch (err) {
         expect(err instanceof NotFoundError).toBeTruthy();
      }
   });
});

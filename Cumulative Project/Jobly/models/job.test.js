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

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

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
      expect(job).toEqual(newJob);

      const result = await db.query(
         `SELECT title, salary, equity, company_handle AS "company"
           FROM jobs
           WHERE title = 'new'`
      );
      expect(result.rows).toEqual([
         {
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
            title: "j1",
            salary: 1,
            equity: "0.1",
            company: "c1",
         },
         {
            title: "j2",
            salary: 2,
            equity: "0.2",
            company: "c2",
         },
         {
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
      let job = await Job.get("j1");
      expect(job).toEqual({
         title: "j1",
         salary: 1,
         equity: "0.1",
         company: "c1",
      });
   });

   test("not found if no such job", async function () {
      try {
         await Job.get("nope");
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
      let job = await Job.update("j1", updateData);
      expect(job).toEqual({
         company: "c1",
         ...updateData,
      });

      const result = await db.query(
         `SELECT title, salary, equity, company_handle AS "company"
           FROM jobs
           WHERE title = 'New'`
      );
      expect(result.rows).toEqual([
         {
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

      let job = await Job.update("j1", updateDataSetNulls);
      expect(job).toEqual({
         company: "c1",
         ...updateDataSetNulls,
      });

      const result = await db.query(
         `SELECT title, salary, equity, company_handle AS "company"
          FROM jobs
          WHERE title = 'New'`
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
         await Job.update("nope", updateData);
         fail();
      } catch (err) {
         expect(err instanceof NotFoundError).toBeTruthy();
      }
   });

   test("bad request with no data", async function () {
      try {
         await Job.update("j1", {});
         fail();
      } catch (err) {
         expect(err instanceof BadRequestError).toBeTruthy();
      }
   });
});

// /************************************** remove */

describe("remove", function () {
   test("works", async function () {
      await Job.remove("j1");
      const res = await db.query("SELECT title FROM jobs WHERE title='j1'");
      expect(res.rows.length).toEqual(0);
   });

   test("not found if no such job", async function () {
      try {
         await Job.remove("nope");
         fail();
      } catch (err) {
         expect(err instanceof NotFoundError).toBeTruthy();
      }
   });
});

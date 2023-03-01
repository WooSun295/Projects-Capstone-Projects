"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
   commonBeforeAll,
   commonBeforeEach,
   commonAfterEach,
   commonAfterAll,
   userToken,
   adminToken,
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

/************************************** POST /jobs */

describe("POST /jobs", function () {
   const newJob = {
      title: "new",
      salary: 1234,
      equity: 0.0,
      company_handle: "c1",
   };

   test("ok for admin", async function () {
      const resp = await request(app)
         .post("/jobs")
         .send(newJob)
         .set("authorization", `Bearer ${adminToken}`);

      expect(resp.statusCode).toEqual(201);
      expect(resp.body).toEqual({
         job: { ...newJob, equity: "0", id: resp.body.job.id },
      });
   });

   test("not ok for users", async function () {
      const resp = await request(app)
         .post("/jobs")
         .send(newJob)
         .set("authorization", `Bearer ${userToken}`);

      expect(resp.statusCode).toEqual(401);
   });

   test("bad request with missing data", async function () {
      const resp = await request(app)
         .post("/jobs")
         .send({
            title: "new",
            salary: 10,
         })
         .set("authorization", `Bearer ${adminToken}`);

      expect(resp.statusCode).toEqual(400);
   });

   test("bad request with invalid data", async function () {
      const resp = await request(app)
         .post("/jobs")
         .send({
            ...newJob,
            salary: -100,
         })
         .set("authorization", `Bearer ${adminToken}`);

      expect(resp.statusCode).toEqual(400);
   });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
   test("ok for anon", async function () {
      const resp = await request(app).get("/jobs");
      expect(resp.body).toEqual({
         jobs: [
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
         ],
      });
   });

   test("filters jobs by title", async function () {
      const resp = await request(app).get("/jobs?title=3");
      expect(resp.body).toEqual({
         jobs: [
            {
               id: job3.id,
               title: "j3",
               salary: 3,
               equity: "0.3",
               company: "c3",
            },
         ],
      });
   });

   test("filters jobs by minSalary", async function () {
      const resp = await request(app).get("/jobs?minSalary=2");
      expect(resp.body).toEqual({
         jobs: [
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
         ],
      });
   });

   test("filters jobs by hasEquity", async function () {
      const resp = await request(app).get("/jobs?hasEquity=true");
      expect(resp.body).toEqual({
         jobs: [
            {
               id: job1.id,
               title: "j1",
               salary: 1,
               equity: "0.1",
               company: "c1",
            },
            {
               id: job3.id,
               title: "j3",
               salary: 3,
               equity: "0.3",
               company: "c3",
            },
         ],
      });
   });

   test("filters jobs by all", async function () {
      const resp = await request(app).get("/jobs?title=j&minSalary=2&hasEquity=true");
      expect(resp.body).toEqual({
         jobs: [
            {
               id: job3.id,
               title: "j3",
               salary: 3,
               equity: "0.3",
               company: "c3",
            },
         ],
      });
   });

   test("Return error if minSalary < 0", async function () {
      const resp = await request(app).get("/jobs?minSalary=-10");
      expect(resp.statusCode).toEqual(400);
   });

   test("fails: test next() handler", async function () {
      // there's no normal failure event which will cause this route to fail ---
      // thus making it hard to test that the error-handler works with it. This
      // should cause an error, all right :)
      await db.query("DROP TABLE jobs CASCADE");
      const resp = await request(app)
         .get("/jobs")
         .set("authorization", `Bearer ${adminToken}`);
      expect(resp.statusCode).toEqual(500);
   });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
   test("works for anon", async function () {
      const resp = await request(app).get(`/jobs/${job1.id}`);
      expect(resp.body).toEqual({
         job: {
            id: job1.id,
            title: "j1",
            salary: 1,
            equity: "0.1",
            company: "c1",
         },
      });
   });

   test("not found for no such jobs", async function () {
      const resp = await request(app).get(`/jobs/-1`);
      expect(resp.statusCode).toEqual(404);
   });
});

/************************************** PATCH /jobs/:title */

describe("PATCH /jobs/:id", function () {
   test("works for admin", async function () {
      const resp = await request(app)
         .patch(`/jobs/${job1.id}`)
         .send({
            title: "j1-new",
         })
         .set("authorization", `Bearer ${adminToken}`);

      expect(resp.body).toEqual({
         job: {
            id: job1.id,
            title: "j1-new",
            salary: 1,
            equity: "0.1",
            company: "c1",
         },
      });
   });

   test("unauth for user", async function () {
      const resp = await request(app)
         .patch(`/jobs/${job1.id}`)
         .send({
            title: "j1-new",
         })
         .set("authorization", `Bearer ${userToken}`);

      expect(resp.statusCode).toEqual(401);
   });

   test("unauth for anon", async function () {
      const resp = await request(app).patch(`/jobs/${job1.id}`).send({
         title: "j1-new",
      });
      expect(resp.statusCode).toEqual(401);
   });

   test("not found on no such job", async function () {
      const resp = await request(app)
         .patch(`/jobs/-1`)
         .send({
            title: "new nope",
         })
         .set("authorization", `Bearer ${adminToken}`);

      expect(resp.statusCode).toEqual(404);
   });

   test("bad request on handle change attempt", async function () {
      const resp = await request(app)
         .patch(`/jobs/${job1.id}`)
         .send({
            handle: "c1-new",
         })
         .set("authorization", `Bearer ${adminToken}`);

      expect(resp.statusCode).toEqual(400);
   });

   test("bad request on invalid data", async function () {
      const resp = await request(app)
         .patch(`/jobs/${job1.id}`)
         .send({
            salary: -100,
         })
         .set("authorization", `Bearer ${adminToken}`);

      expect(resp.statusCode).toEqual(400);
   });
});

/************************************** DELETE /jobs/:title */

describe("DELETE /jobs/:id", function () {
   test("works for admin", async function () {
      const resp = await request(app)
         .delete(`/jobs/${job1.id}`)
         .set("authorization", `Bearer ${adminToken}`);

      expect(resp.body).toEqual({ deleted: `${job1.id}` });
   });

   test("unauth for users", async function () {
      const resp = await request(app)
         .delete(`/jobs/${job1.id}`)
         .set("authorization", `Bearer ${userToken}`);

      expect(resp.statusCode).toEqual(401);
   });

   test("unauth for anon", async function () {
      const resp = await request(app).delete(`/jobs/${job1.id}`);
      expect(resp.statusCode).toEqual(401);
   });

   test("not found for no such job", async function () {
      const resp = await request(app)
         .delete(`/jobs/-1`)
         .set("authorization", `Bearer ${adminToken}`);

      expect(resp.statusCode).toEqual(404);
   });
});

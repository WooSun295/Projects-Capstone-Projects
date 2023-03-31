"use strict";

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");

const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const pokewikiRoutes = require("./routes/pokewiki");

const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/pokewiki", pokewikiRoutes);
app.get("/", (req, res) => {
   return res.json({
      defined_routes: {
         auth: {
            main: "/auth",
            restrictions: "none",
            routes: {
               1: "POST /login",
               2: "POST /signup",
            },
         },
         users: {
            main: "/users",
            restrictions: "User Token",
            routes: {
               1: "GET /:username",
               2: "POST /:username/favs/:id",
               3: "GET /:username/favs",
               4: "DELETE /:username/favs/:id",
               5: "PATCH /:username",
               6: "DELETE /:username",
            },
         },
         pokewiki: {
            main: "/pokewiki",
            restrictions: "none",
            routes: {
               1: "GET /:category",
               2: "GET /:category/:id",
            },
         },
      },
   });
});

// 404 errors, if nothing matches
app.use((req, res, next) => {
   return next(new NotFoundError());
});

// Error handler
app.use((err, req, res, next) => {
   const status = err.status || 500;
   const msg = err.message;

   return res.status(status).json({
      error: { msg, status },
   });
});

module.exports = app;

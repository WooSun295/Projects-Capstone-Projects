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

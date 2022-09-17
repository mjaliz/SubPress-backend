const dbDebugger = require("debug")("app:db");
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("./startup/routes")(app);

mongoose
  .connect("mongodb://localhost/subpress")
  .then(() => console.log("Connected to MongoDB..."))
  .catch(() => console.log("Connecting to MongoDB failed..."));

// db work...
dbDebugger("Connected to the database...");

console.log(`Application Name: ${config.get("name")}`);
console.log(`Mail server: ${config.get("mail.host")}`);
// console.log(`Mail server password: ${config.get("mail.password")}`);

const PORT = process.env.PORT || 8000;

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
});

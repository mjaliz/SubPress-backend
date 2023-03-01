const dbDebugger = require("debug")("app:db");
const config = require("config");
const helmet = require("helmet");
const morgan = require("morgan");
const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

require("dotenv").config();
require("./startup/routes")(app);

// Use this mongoURI in Ubuntu
const mongoURI = `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}:${process.env.MONGODB_DOCKER_PORT}/${process.env.MONGODB_DATABASE}?authSource=admin`;

mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB..."))
  .catch(() => console.log("Connecting to MongoDB failed..."));

// db work...
dbDebugger("Connected to the database...");

console.log(mongoURI);
// console.log(`Application Name: ${config.get("name")}`);
// console.log(`Mail server: ${config.get("mail.host")}`);
// console.log(`Mail server password: ${config.get("mail.password")}`);

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
});

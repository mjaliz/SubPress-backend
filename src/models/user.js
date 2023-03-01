const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const srcSchema = new mongoose.Schema({
  title: String,
  start: String,
  end: String,
});

const flashCardSchema = new mongoose.Schema({
  src: {
    type: srcSchema,
    default: {},
  },
  status: {
    type: String,
    default: "selected",
  },
  front: [String],
  back: [String],
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 7,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
  flashCards: {
    type: [flashCardSchema],
    required: true,
    default: [],
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin,
    },
    process.env.JWT_KEY
  );
  return token;
};

const User = mongoose.model("User", userSchema);

const schema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().min(7).max(255).required().email(),
  password: Joi.string().min(5).max(1024).required(),
});

exports.User = User;
exports.joiSchema = schema;

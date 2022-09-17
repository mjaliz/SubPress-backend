const mongoose = require("mongoose");
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
  front: [String],
  back: [String],
});

const itemsSchema = new mongoose.Schema({
  selectedWords: { type: Array, required: true, default: [] },
  knownWords: { type: Array, required: true, default: [] },
  notKnownWords: { type: Array, required: true, default: [] },
  notSureWords: { type: Array, required: true, default: [] },
});

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  items: {
    type: itemsSchema,
    required: true,
    default: {},
  },
  flashCards: {
    type: [flashCardSchema],
    required: true,
    default: [],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

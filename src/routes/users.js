const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User, joiSchema } = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = joiSchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();
  user.token = token;

  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .send(_.pick(user, ["_id", "name", "email", "token"]));
});

router.post("/selectedWord", async (req, res) => {
  const items = req.body;
  let user = await User.findById(req.body.userId);
  if (!user) return res.status(400).send("User not found");
  const flashCard = {
    src: {
      title: items.flashCard.src.title,
      start: items.flashCard.src.startTime,
      end: items.flashCard.src.endTime,
    },
    front: items.flashCard.front,
    back: items.flashCard.back,
  };
  console.log(flashCard);
  user.flashCards.push(flashCard);
  user.save();
  res.send(_.pick(user, ["flashCards"]));
});

router.get("/selectedWord", async (req, res) => {
  let flashCards = await User.findById(req.query.userId).select("flashCards");
  if (!flashCards) flashCards = [];
  res.send(flashCards);
});

router.patch("/selectedWord", async (req, res) => {
  const flashCardId = req.body.id;
  const status = req.body.status;
  await User.updateOne(
    { "flashCards._id": flashCardId },
    { $set: { "flashCards.$.status": status } }
  );
  res.send({ id: flashCardId });
});

module.exports = router;

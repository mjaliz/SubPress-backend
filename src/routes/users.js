const User = require("../models/user");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
  });

  await user.save();
  res.send(user);
});

router.post("/selectedWord", async (req, res) => {
  const items = req.body;
  let user = await User.findOne({ _id: "63255fb632ee5573a71d5c9c" });
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
  user.items.selectedWords.push(items.flashCard.front[0]);
  user.save();
  res.send(user);
});

router.get("/selectedWord", async (req, res) => {
  const flashCards = await User.findOne({
    _id: "63255fb632ee5573a71d5c9c",
  }).select("flashCards");
  console.log(flashCards);
  res.send(flashCards);
});

module.exports = router;

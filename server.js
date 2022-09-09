const Joi = require("joi");
const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 8000;

app.get("/video/:id", function (req, res) {
  console.log(req.params.id);
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }
  const videoPath = req.params.id;
  const videoSize = fs.statSync(req.params.id).size;
  const CHUNK_SIZE = 100 ** 6;
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };
  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(videoPath, { start, end });
  videoStream.pipe(res);
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}...`);
});

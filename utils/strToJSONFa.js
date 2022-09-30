console.log(__dirname);
const fs = require("fs");

const timeToMillisecond = (time) => {
  const [hh, mm, ss, ms] = time.split(":");
  const timestamp =
    parseInt(hh) * 3600000 +
    parseInt(mm) * 6000 +
    parseInt(ss) * 1000 +
    parseInt(ms);

  return timestamp;
};

const timeSecond = (time) => {
  const [hh, mm, ss, ms] = time.split(":");
  const timestamp =
    parseInt(hh) * 3600 +
    parseInt(mm) * 60 +
    parseInt(ss) +
    parseInt(ms) * 0.001;

  return timestamp;
};

fs.readFile(__dirname + "\\..\\assets\\demo2-en.srt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  dataArray = data.split("\r\n");
  // console.log(dataArray);

  const subtitles = [];
  const startTimes = [];
  let j = 0;

  for (let i = 0; i < dataArray.length; i++) {
    const id = parseInt(dataArray[i]);
    if (id > 0) {
      subtitles.push({ id });
      continue;
    }

    const times = dataArray[i].split(" --> ");
    if (times.length === 2) {
      let startTime = times[0].trim();
      let endTime = times[1].trim();
      startTimes.push(startTime);
      startTime = startTime.replace(",", ":");
      endTime = endTime.replace(",", ":");
      const startTimestamp = timeToMillisecond(startTime);
      const endTimestamp = timeToMillisecond(endTime);
      const duration = Math.abs(endTimestamp - startTimestamp);
      subtitles[j].startTime = timeSecond(startTime);
      subtitles[j].duration = duration;
      subtitles[j].endTime = timeSecond(startTime) + duration / 1000;
      continue;
    }
    const text = dataArray[i];
    if (typeof text === "string" && text.length > 0) {
      // if (subtitle[j]?.text) {

      if (!subtitles[j]) {
        subtitles[j - 1].text = subtitles[j - 1].text + " " + text.trim();
      } else {
        subtitles[j].text = text.trim();
        j++;
      }
      // } else {
      //   subtitle[j].text += text.trim();
      // }
    }
  }

  const newSubtitles = subtitles.slice(4, subtitles.length);
  const newStartTimes = startTimes.slice(4, startTimes.length);

  fs.writeFile(
    "startTime.json",
    JSON.stringify(startTimes),
    { flag: "wx" },
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    }
  );

  fs.writeFile(
    "subtitle.json",
    JSON.stringify(subtitles),
    { flag: "wx" },
    function (err) {
      if (err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    }
  );
});

const express = require("express");
const app = express();
const sampleSize = require("lodash.samplesize");
const { wowArr } = require("./wowArr");

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.redirect("wows/random");
  return;
});

app.get("/wows/random", (req, res) => {
  const numResults = Number(req.query.results);
  const year = Number(req.query.year);
  const numberCurrentWow = Number(req.query.wow_in_movie);
  const movieName = req.query.movie;

  let viableWows = wowArr;

  if (movieName) {
    viableWows = viableWows.filter((wow) =>
      wow.movie.toLowerCase().includes(movieName.toLowerCase())
    );
  }

  if (year) {
    viableWows = viableWows.filter((wow) => wow.year === year);
  }

  if (numberCurrentWow) {
    viableWows = viableWows.filter(
      (wow) => wow.current_wow_in_movie === numberCurrentWow
    );
  }

  const randomWow = sampleSize(
    viableWows,
    numResults ? (numResults >= 50 ? 50 : numResults) : 1
  );

  res.send(randomWow);
  return;
});

app.get("/wows/ordered/:index?", (req, res) => {
  if (req.params.index) {
    if (Number(req.params.index) || req.params.index === "0") {
      if (wowArr[Number(req.params.index)]) {
        res.send(wowArr[Number(req.params.index)]);
      } else {
        res.send([]);
      }
    } else {
      const digitDashRegex = /^\d{1,2}-+\d{1,2}/gm;

      if (digitDashRegex.test(req.params.index)) {
        const splitIndeces = req.params.index.split("-");
        const firstNum = Number(splitIndeces[0]);
        const secondNum = Number(splitIndeces[1]);

        if ((firstNum || firstNum === 0) && (secondNum || secondNum === 0)) {
          const result = wowArr.slice(
            firstNum,
            Math.abs(secondNum - firstNum) >= 50 ? firstNum + 50 : secondNum + 1
          );

          res.send(result);
        } else {
          res
            .status(400)
            .send(
              "400 Bad Request: Index should be a number or a range between two numbers"
            );
        }
      } else {
        res
          .status(400)
          .send(
            "400 Bad Request: Index should be a number or a range between two numbers"
          );
      }
    }
  } else {
    res.redirect("/wows/ordered/0");
  }
  return;
});

app.get("*", (req, res) => {
  res.redirect("/wows/random");
  return;
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

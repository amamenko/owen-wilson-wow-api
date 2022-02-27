const express = require("express");
const app = express();
const sampleSize = require("lodash.samplesize");
const { wowArr } = require("./wowArr");

const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.redirect("random");
});

app.get("/random", (req, res) => {
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
});

app.all("*", (req, res) => {
  res.redirect("random");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

const express = require("express");
const app = express();
const sampleSize = require("lodash.samplesize");
const cors = require("cors");
const { wowArr } = require("./wowArr");
const enforce = require("express-sslify");
require("dotenv").config();

const port = process.env.PORT || 4000;

// Enable all cross-origin requests
app.use(cors());

if (process.env.NODE_ENV === "production") {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.get("/wows/random", (req, res) => {
  const numResults = Number(req.query.results);
  const year = Number(req.query.year);
  const numberCurrentWow = Number(req.query.wow_in_movie);
  const movieName = req.query.movie;
  const directorName = req.query.director;
  const sortBy = req.query.sort;
  const direction = req.query.direction;

  let viableWows = wowArr;

  if (movieName) {
    viableWows = viableWows.filter((wow) =>
      wow.movie.toLowerCase().includes(movieName.toLowerCase())
    );
  }

  if (directorName) {
    viableWows = viableWows.filter((wow) =>
      wow.director.toLowerCase().includes(directorName.toLowerCase())
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

  let randomWow = sampleSize(viableWows, numResults ? numResults : 1);

  if (sortBy) {
    if (sortBy === "movie") {
      if (direction === "desc") {
        randomWow = randomWow.sort((a, b) => b.movie.localeCompare(a.movie));
      } else {
        randomWow = randomWow.sort((a, b) => a.movie.localeCompare(b.movie));
      }
    } else if (sortBy === "release_date") {
      if (direction === "desc") {
        randomWow = randomWow.sort((a, b) =>
          b.release_date.localeCompare(a.release_date)
        );
      } else {
        randomWow = randomWow.sort((a, b) =>
          a.release_date.localeCompare(b.release_date)
        );
      }
    } else if (sortBy === "year") {
      if (direction === "desc") {
        randomWow = randomWow.sort((a, b) => b.year - a.year);
      } else {
        randomWow = randomWow.sort((a, b) => a.year - b.year);
      }
    } else if (sortBy === "director") {
      if (direction === "desc") {
        randomWow = randomWow.sort((a, b) =>
          b.director.localeCompare(a.director)
        );
      } else {
        randomWow = randomWow.sort((a, b) =>
          a.director.localeCompare(b.director)
        );
      }
    } else if (sortBy === "number_current_wow") {
      if (direction === "desc") {
        randomWow = randomWow.sort(
          (a, b) => b.current_wow_in_movie - a.current_wow_in_movie
        );
      } else {
        randomWow = randomWow.sort(
          (a, b) => a.current_wow_in_movie - b.current_wow_in_movie
        );
      }
    } else if (sortBy === "size_kb") {
      if (direction === "desc") {
        randomWow = randomWow.sort(
          (a, b) => b.video["1080p"].size_kb - a.video["1080p"].size_kb
        );
      } else {
        randomWow = randomWow.sort(
          (a, b) => a.video["1080p"].size_kb - b.video["1080p"].size_kb
        );
      }
    } else if (sortBy === "length") {
      if (direction === "desc") {
        randomWow = randomWow.sort(
          (a, b) => b.audio.length - a.audio.length
        );
      } else {
        randomWow = randomWow.sort(
          (a, b) => a.audio.length - b.audio.length
        );
      }
    }
  }

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
          const result = wowArr.slice(firstNum, secondNum + 1);

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

const getUniqueValuesFromArr = (arr, str) => {
  const allResults = arr.map((wow) => wow[str]);
  const uniqueResults = [...new Set(allResults)];
  return uniqueResults;
};

app.get("/wows/movies", (req, res) => {
  res.send(getUniqueValuesFromArr(wowArr, "movie"));
});

app.get("/wows/directors", (req, res) => {
  res.send(getUniqueValuesFromArr(wowArr, "director"));
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  // Redirect to root in case no path match
  app.use((req, res, next) => {
    if (req.path !== "/") {
      return res.redirect("/");
    }
    next();
  });

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("*", (req, res) => {
    res.redirect("/");
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});

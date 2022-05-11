import Logo from "./assets/images/Logo.png";
import { useEffect, useState } from "react";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import prettyHtml from "json-pretty-html";
import { FaGithub } from "react-icons/fa";
import { AiFillTwitterCircle } from "react-icons/ai";
import ReactPlayer from "react-player";
import ReactAudioPlayer from "react-audio-player";
import KofiButton from "kofi-button";
import "./App.css";

const App = () => {
  const [showMore, changeShowMore] = useState(false);
  const [videoPlaying, changeVideoPlaying] = useState(false);
  const [exampleResponse, changeExampleResponse] = useState("");
  const [exampleJSON, changeExampleJSON] = useState([]);

  const toggleMore = () => {
    changeShowMore(!showMore);
  };

  const getExample = async () => {
    await axios
      .get(
        process.env.REACT_APP_NODE_ENV === "production"
          ? "https://theceebee-wow.herokuapp.com/wows/random"
          : "http://localhost:4000/wows/random"
      )
      .then((res) => res.data)
      .then((data) => {
        changeExampleResponse(prettyHtml(data));
        changeExampleJSON(data[0]);

        const previewEl = document.getElementsByClassName(
          "react-player__preview"
        );

        if (previewEl[0]) {
          previewEl[0].style.backgroundImage = `url(${data[0].poster}), url(${data[0].poster}) !important;`;
        }
      })
      .catch((e) => console.error(e));
  };

  useEffect(() => {
    getExample();
  }, []);

  return (
    <div className="main_wrapper">
      <div className="main_container">
        <img className="api_logo" src={Logo} alt="API Logo" />
      </div>
      <div className="explanation_paragraphs">
        <p>
          <b>
            <a
              href="https://theceebee-wow.herokuapp.com"
              rel="noreferrer noopener"
            >
              theceebee-wow.herokuapp.com
            </a>
          </b>{" "}
          is a free JSON API for actor Owen Wilson's "wow" exclamations in
          movies.
          <br />
          <br />
          <a href="https://wow.readme.io" rel="noreferrer noopener">
            View the full API docs
          </a>{" "}
          (powered by{" "}
          <a href="https://readme.com" rel="noreferrer noopener">
            ReadMe 🦉
          </a>
          )
          <br />
          <br />
          <u className="read_more" onClick={toggleMore}>
            Read more
          </u>
        </p>
        <p className={`paragraph ${showMore ? "" : "hidden"}`}>
          Owen Wilson's "wow" is a{" "}
          <a
            href="https://knowyourmeme.com/memes/owen-wilsons-wow"
            rel="noreferrer noopener"
            target="_blank"
          >
            meme
          </a>{" "}
          referring to jokes about Owen Wilson's unique intonation when saying
          the word "wow." Various parody and remix videos have been made of
          "wow" utterances, starting in 2013 with a{" "}
          <a
            href="https://www.youtube.com/watch?v=rOGbMwXnlQM"
            rel="noreferrer noopener"
          >
            video
          </a>{" "}
          made by YouTuber Andrew Barber in which he impersonates Owen Wilson.
        </p>
        <p className={`paragraph ${showMore ? "" : "hidden"}`}>
          In 2015, YouTuber Owenergy uploaded a{" "}
          <a
            href="https://www.youtube.com/watch?v=dn5Tattkj_E"
            rel="noreferrer noopener"
          >
            video
          </a>{" "}
          showing a supercut of movies (in chronological order) in which Owen
          Wilson says the word "wow." This video claimed that Owen Wilson has
          said the word "wow" a total of 102 times (spanning the years
          1996-2017) over the course of his film career.
        </p>
        <p className={`paragraph ${showMore ? "" : "hidden"}`}>
          Many of the scenes mentioned in Owenergy's famous video mistakenly
          count phrases such as "oh," "whoa," and "pow" as "wow" occurrences and
          are therefore not included as part of the Owen Wilson Wow API - the
          total "wow" count of which stands at 91 as of{" "}
          {new Date().getFullYear()}. Additionally, many of the "wow" scenes in
          Owenergy's YouTube video are out of order and are corrected in this
          API.
        </p>
      </div>
      <h2>Usage</h2>
      <h3>Random "Wow"</h3>
      <p>Retrieve a random "wow" in JSON format.</p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/random">
            https://theceebee-wow.herokuapp.com/wows/random
          </a>
        </code>
      </pre>
      <p>Example JSON response:</p>
      <pre>
        <code className="request">
          {exampleResponse ? (
            <div dangerouslySetInnerHTML={{ __html: exampleResponse }} />
          ) : (
            <ClipLoader
              color={"#000"}
              loading={exampleResponse ? false : true}
              size={15}
            />
          )}
        </code>
      </pre>
      <p>Rendered JSON response poster and video:</p>
      {exampleJSON && exampleJSON.video && exampleJSON.poster ? (
        <div className="example_wrapper">
          <div className="interactive_wrapper">
            <div
              className="player-wrapper"
              style={{ backgroundImage: "url(" + exampleJSON.poster + ")" }}
            >
              <div className="blur">
                <ReactPlayer
                  playing={videoPlaying}
                  onClickPreview={() => changeVideoPlaying(true)}
                  onEnded={() => changeVideoPlaying(false)}
                  url={exampleJSON.video["360p"]}
                  controls={true}
                  light={exampleJSON.poster}
                  style={{ maxWidth: "600px", overflow: "hidden" }}
                />
              </div>
            </div>
            <p>Rendered JSON response audio:</p>
            <ReactAudioPlayer
              src={exampleJSON.audio}
              controls
              style={{ width: "100%" }}
            />
          </div>
        </div>
      ) : (
        <div className="example_wrapper">
          <ClipLoader color={"#000"} loading={true} size={100} />
        </div>
      )}
      <div className="refresh-button-wrapper">
        <button class="wow-button" type="button" onClick={getExample}>Load a new example. Wow!</button>
      </div>
      <h4>Multiple Results</h4>
      <p>Retrieve a specific number of random "wow" results.</p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/random?results=5">
            https://theceebee-wow.herokuapp.com/wows/random?results=5
          </a>
        </code>
      </pre>
      <h4>Specify year</h4>
      <p>Retrieve a random "wow" from a specific year.</p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/random?year=2011">
            https://theceebee-wow.herokuapp.com/wows/random?year=2011
          </a>
        </code>
      </pre>
      <h4>Specify movie</h4>
      <p>Retrieve a random "wow" by the name of the movie it appears in.</p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/random?movie=zoolander">
            https://theceebee-wow.herokuapp.com/wows/random?movie=zoolander
          </a>
        </code>
      </pre>
      <h4>Specify director</h4>
      <p>Retrieve a random "wow" from a movie with a particular director.</p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/random?director=wes%20anderson">
            https://theceebee-wow.herokuapp.com/wows/random?director=wes%20anderson
          </a>
        </code>
      </pre>
      <h4>Specify movie occurrence number</h4>
      <p>Retrieve a random "wow" by the number of its occurrence in a movie.</p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/random?wow_in_movie=2">
            https://theceebee-wow.herokuapp.com/wows/random?wow_in_movie=2
          </a>
        </code>
      </pre>
      <h4>Sort multiple results</h4>
      <p>
        Sort multiple random results by either movie, release_date, year,
        director, or number_current_wow. Sort direction can be either asc
        (ascending) or desc (descending).
      </p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/random?results=10&sort=movie&direction=desc">
            https://theceebee-wow.herokuapp.com/wows/random?results=10&sort=movie&direction=desc
          </a>
        </code>
      </pre>
      <h3>Ordered "Wow"</h3>
      <p>
        Retrieve a specific "wow" by its index in the chronological order of all
        results.
      </p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/ordered/0">
            https://theceebee-wow.herokuapp.com/wows/ordered/0
          </a>
        </code>
      </pre>
      <h4>Multiple Ordered "Wow" Results</h4>
      <p>
        Retrieve all "wow" results between a first index and a second index,
        inclusive, in the chronological order of all results.
      </p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/ordered/3-7">
            https://theceebee-wow.herokuapp.com/wows/ordered/3-7
          </a>
        </code>
      </pre>
      <h3>All Movies</h3>
      <p>Retrieve all names of movies in which Owen Wilson says "wow."</p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/movies">
            https://theceebee-wow.herokuapp.com/wows/movies
          </a>
        </code>
      </pre>
      <h3>All Directors</h3>
      <p>Retrieve all directors of movies in which Owen Wilson says "wow."</p>
      <pre>
        <code className="request get">
          <a href="https://theceebee-wow.herokuapp.com/wows/directors">
            https://theceebee-wow.herokuapp.com/wows/directors
          </a>
        </code>
      </pre>
      <div className="contact">
        <p>
          <b>Contact:</b> If you have a correction or a suggestion for the API,
          feel free to open up an{" "}
          <a
            href="https://github.com/amamenko/theceebee-wow/issues"
            rel="noopener noreferrer"
          >
            issue
          </a>{" "}
          on its{" "}
          <a
            href="https://github.com/amamenko/theceebee-wow"
            rel="noopener noreferrer"
          >
            GitHub repository
          </a>
          . If you have a comment or a question about the API, you may reach out
          to its creator on Twitter{" "}
          <a href="https://twitter.com/AviMamenko" rel="noopener noreferrer">
            @AviMamenko
          </a>{" "}
          or by filling out the contact form on{" "}
          <a href="https://amamenko.github.io" rel="noopener noreferrer">
            his website
          </a>
          .
        </p>
      </div>
      <div className="disclaimer">
        <p>
          <b>Disclaimer:</b> The Owen Wilson Wow API is not affiliated,
          associated, authorized, endorsed by, or in any way officially
          connected with Owen Wilson, or any of his subsidiaries or affiliates.
          All motion pictures, products, and brands mentioned on this website
          are the respective trademarks and copyrights of their owners.
        </p>
      </div>
      <p>
        The Owen Wilson Wow API was created in 2022 by{" "}
        <a href="https://amamenko.github.io" rel="noopener noreferrer">
          Avi Mamenko
        </a>
        .
      </p>
      <div className="support_container">
        <p>Loving the Owen Wilson Wow API?</p>
        <KofiButton
          color="#1068b3"
          title="Support Avi on Ko-fi"
          kofiID="E1E3CFTNF"
        />
      </div>
      <div className="bottom_icons">
        <a
          href="https://github.com/amamenko/theceebee-wow"
          rel="noopener noreferrer"
        >
          <FaGithub color="#000" size="50" />
        </a>
        <a href="https://twitter.com/AviMamenko" rel="noopener noreferrer">
          <AiFillTwitterCircle color="#000" size="55" />{" "}
        </a>
      </div>
    </div>
  );
};

export default App;

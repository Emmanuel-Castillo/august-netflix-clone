import React, { useEffect, useState } from "react";
import "../styles/Banner.css";
import axios from "../axios.js";
import requests from "../requests.js"

function Banner() {
  const [movie, setMovie] = useState([])

  useEffect(() => {
    async function fetchData() {
      const request = await axios.get(requests.fetchNetflixOriginals);
      setMovie(
        request.data.results[
          Math.floor(Math.random() * request.data.results.length - 1)
        ]
      )
    }

    fetchData()
  },[])


  function truncate(string, n) {
    return string?.length > n ? string.substring(0, n-1) + '...' : string
  }

  return (
    <header
      className="banner"
      style={{
        backgroundSize: "cover",
        backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie?.backdrop_path}")`,
        backgroundPosition: "center center",
      }}
    >
      <div className="banner__contents">
        <h1 className="banner__title">{movie?.title || movie?.name || movie?.original_name}</h1>
        <div className="banner__buttons">
          <button className="banner__button">Play</button>
          <button className="banner__button">My List</button>

          <h1 className="banner__description">
            {truncate(movie?.overview,150)}
          </h1>
        </div>

      </div>
        <div className="banner--fadeBottom"/>
    </header>
  );
}

export default Banner;

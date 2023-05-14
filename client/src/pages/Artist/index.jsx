import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { Button, message, Rate } from "antd";

import { useNavigate, useParams } from "react-router-dom";

import { GetArtistById } from "../../apis/artists";
import { getDateFormat } from "../../helpers";
import { GetMoviesByArtistId } from "../../apis/movies";

function Artist() {
  const [artist, setArtist] = useState(null);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const artistResponse = await GetArtistById(id);
      setArtist(artistResponse.data);
      const moviesResponse = await GetMoviesByArtistId(id);
      setMovies(moviesResponse.data);
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-10 mb-5">
        <img
          src={artist?.images[0] || ""}
          alt=""
          className="h-72 w-96 lg:h-[350px] lg:w-[600px] rounded"
        />

        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-gray-600 mb-2">
            {artist?.name}
          </h1>
          <hr />

          <div className="flex flex-col gap-1 text-gray-600 w-96 text-sm mt-5">
            <div className="flex justify-between">
              <span>Profession</span>
              <span className="capitalize">{artist?.proffession}</span>
            </div>

            <div className="flex justify-between">
              <span>DOB</span>
              <span className="capitalize">{getDateFormat(artist?.dob)}</span>
            </div>

            <div className="flex justify-between">
              <span>Debut Year</span>
              <span className="capitalize">{artist?.debutYear}</span>
            </div>

            <div className="flex justify-between">
              <span>Debut Movie</span>
              <span className="capitalize">{artist?.debutMovie}</span>
            </div>

            <div className="flex justify-between">
              <span>Bio</span>
              <span className="capitalize">{artist?.bio}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 mb-10">
        <span className="text-gray-600 font-semibold text-md">Movies</span>
        <div className="mt-2 flex gap-5">
          {movies.map((movie) => {
            return (
              <div
                key={artist?._id}
                className="cursor-pointer flex flex-col "
                onClick={() => navigate(`/movie/${movie?._id}`)}
              >
                <img
                  src={movie?.posters[0] || ""}
                  alt=""
                  className="w-24 h-20 rounded"
                />
                <span className="text-sm text-gray-600">{movie?.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Artist;

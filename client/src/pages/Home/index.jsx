import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { message, Rate } from "antd";
import { GetAllMovies } from "../../apis/movies";
import { useNavigate } from "react-router-dom";
import Filters from "../../components/Filters";

function Home() {
  const [filters, setFilters] = useState({ search: "" , genre: "" , language: "" });
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  const dispatch = useDispatch();
  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllMovies(filters);
      setMovies(response.data);
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, [filters.genre , filters.language]);

  return (
    <div>
      <Filters 
        filters={filters}
        setFilters={setFilters}
       />
      <div className="grid grid-cols-1 sm-grid-cols-2 lg:grid-cols-4 gap-10 text-gray-600">
        {movies.map((movie) => {
          return (
            <div
              key={movie?._id}
              className="cursor-pointer"
              onClick={() => navigate(`/movie/${movie?._id}`)}
            >
              <img
                src={movie?.posters[0] || ""}
                alt=""
                className="h-44 w-full rounded"
              />

              <h1 className="text-xl font-semibold text-gray-600">
                {movie?.name}
              </h1>

              <hr />

              <div className="flex justify-between text-sm">
                <span>Language</span>
                <span className="capitalize">{movie?.language}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Rating</span>
                <Rate
                  disabled
                  defaultValue={movie?.rating || 0}
                  allowHalf
                  style={{ color: "darkred" }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;

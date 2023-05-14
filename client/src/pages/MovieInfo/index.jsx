import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { Button, message, Rate } from "antd";
import { GetMovieById } from "../../apis/movies";
import { useNavigate, useParams } from "react-router-dom";
import { getDateFormat, getDateTimeFormat } from "../../helpers";
import ReviewForm from "./ReviewForm";
import { GetAllReviews } from "../../apis/reviews";

function MovieInfo() {
  const [reviwes, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [movie, setMovie] = useState();
  const { id } = useParams();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetMovieById(id);
      const reviewsResponse = await GetAllReviews({ movie: id });
      setReviews(reviewsResponse.data);
      setMovie(response.data);
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
    movie && (
      <div>
        <div className="flex flex-col lg:flex-row gap-10 mb-5">
          <img
            src={movie?.posters[0] || ""}
            alt=""
            className="h-72 w-96 lg:h-[350px] lg:w-[600px] rounded"
          />

          <div className="flex flex-col">
            <h1 className="text-2xl font-semibold text-gray-600 mb-2">
              {movie?.name}
            </h1>
            <hr />

            <div className="flex flex-col gap-1 text-gray-600 w-96 text-sm mt-5">
              <div className="flex justify-between">
                <span>Language</span>
                <span className="capitalize">{movie?.language}</span>
              </div>

              <div className="flex justify-between">
                <span>Release Date</span>
                <span className="capitalize">
                  {getDateFormat(movie?.releaseDate)}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Genre</span>
                <span className="capitalize">{movie?.genre}</span>
              </div>

              <div className="flex justify-between">
                <span>Director</span>
                <span className="capitalize">{movie?.director?.name}</span>
              </div>

              <div className="flex justify-between">
                <span>Hero</span>
                <span className="capitalize">{movie?.hero?.name}</span>
              </div>

              <div className="flex justify-between">
                <span>Heroine</span>
                <span className="capitalize">{movie?.heroine?.name}</span>
              </div>
            </div>
          </div>
        </div>

        <span className="py-5 text-gray-600 text-sm">{movie?.plot}</span>

        <div className="mt-5 mb-10">
          <span className="text-gray-600 font-semibold text-md">
            Cast & Crew
          </span>
          <div className="mt-2 flex gap-5">
            {movie?.cast.map((artist) => {
              return (
                <div
                  key={artist?._id}
                  className="cursor-pointer flex flex-col "
                  onClick={() => navigate(`/artist/${artist?._id}`)}
                >
                  <img
                    src={artist?.images[0] || ""}
                    alt=""
                    className="w-24 h-20 rounded"
                  />
                  <span className="text-sm text-gray-600">{artist?.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <hr />

        <div className="flex justify-between items-center mt-5">
          <span className="text-xl font-semibold">Reviews</span>
          <Button type="default" onClick={() => setShowReviewForm(true)}>
            Add Review
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-2">
          {reviwes.map((review) => {
            return (
              <div
                key={review?._id}
                className="flex justify-between border-solid border p-2 rounded-sm border-gray-300"
              >
                <div className="flex flex-col">
                  <span className="text-gray-600 font-semibold text-md">
                    {review?.user?.name}
                  </span>
                  <Rate
                    disabled
                    defaultValue={review?.rating || 0}
                    allowHalf
                    style={{ color: "darkred" }}
                    className="mt-2"
                  />
                  <span className="text-gray-600 text-sm">
                    {review?.comment}
                  </span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">
                    {getDateTimeFormat(review?.createdAt)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {showReviewForm && (
          <ReviewForm
            movie={movie}
            reloadData={getData}
            showReviewForm={showReviewForm}
            setShowReviewForm={setShowReviewForm}
          />
        )}
      </div>
    )
  );
}

export default MovieInfo;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { message, Rate, Table } from "antd";

import { getDateTimeFormat } from "../../helpers";

import { DeleteReview, GetAllReviews } from "../../apis/reviews";
import ReviewForm from "../MovieInfo/ReviewForm";

function Reviews() {
  const [selectedReview, setSelectedReview] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user } = useSelector((state) => state.users);
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const reviewsResponse = await GetAllReviews({ user: user._id });
      setReviews(reviewsResponse.data);
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const deleteReview = async (review) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteReview({
        _id: review._id,
        movie: review.movie._id,
      });
      message.success(response.message);
      getData();
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Movie",
      dataIndex: "movie",
      render: (text, record) => record.movie.name,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (text, record) => (
        <Rate
          disabled
          allowHalf
          value={record.rating}
          style={{ color: "darkred" }}
        />
      ),
    },
    {
      title: "Review",
      dataIndex: "comment",
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      render: (text, record) => getDateTimeFormat(record.createdAt),
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                deleteReview(record);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedReview(record);
                setShowReviewForm(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Table dataSource={reviews} columns={columns} />

      {showReviewForm && (
        <ReviewForm
          showReviewForm={showReviewForm}
          setShowReviewForm={setShowReviewForm}
          selectedReview={selectedReview}
          reloadData={getData}
          movie={selectedReview.movie}
        />
      )}
    </div>
  );
}

export default Reviews;

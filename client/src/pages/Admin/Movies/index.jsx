import { Button, Table, message } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SetLoading } from "../../../redux/loadersSlice";
import { DeleteMovie, GetAllMovies } from "../../../apis/movies";
import { getDateFormat } from "../../../helpers";

function Movies() {
  const [movies, setMovies] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getMovies = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllMovies();
      setMovies(response.data);
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getMovies();
  }, []);

  const deleteMovie = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteMovie(id);
      message.success(response.message);
      getMovies();
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const columns = [
    {
      title: "Movie",
      dataIndex: "name",
      render: (text, record) => {
        const imageUrl = record?.posters?.[0] || "";
        return <img src={imageUrl} alt="" className="w-20 h-20 rounded" />;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      render: (text) => getDateFormat(text),
    },
    {
      title: "Genre",
      dataIndex: "genre",
    },
    {
      title: "Language",
      dataIndex: "language",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        return (
          <div className="flex gap-5">
            <i
              className="ri-delete-bin-line"
              onClick={() => {
                deleteMovie(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                navigate(`/admin/movies/edit/${record._id}`);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            navigate("/admin/movies/add");
          }}
        >
          Add Movie
        </Button>
      </div>

      <div className="mt-5">
        <Table dataSource={movies} columns={columns} />
      </div>
    </div>
  );
}

export default Movies;

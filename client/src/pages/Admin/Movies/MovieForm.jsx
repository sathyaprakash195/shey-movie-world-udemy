import { Button, Form, Select, Tabs, Upload, message } from "antd";
import React from "react";
import { antValidationError } from "../../../helpers";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { GetAllArtists } from "../../../apis/artists";
import { AddMovie, GetMovieById, UpdateMovie } from "../../../apis/movies";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import moment from "moment";
import { UploadImage } from "../../../apis/images";

function MovieForm() {
  const [file, setFile] = React.useState(null);
  const [artists = [], setArtists] = React.useState([]);
  const [movie, setMovie] = React.useState();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const getArtists = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllArtists();
      setArtists(
        response.data.map((artist) => ({
          value: artist._id,
          label: artist.name,
        }))
      );
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const getMovie = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await GetMovieById(id);
      response.data.releaseDate = moment(response.data.releaseDate).format(
        "YYYY-MM-DD"
      );
      response.data.cast = response.data?.cast?.map((artist) => artist._id);
      response.data.hero = response.data?.hero._id;
      response.data.heroine = response.data?.heroine._id;
      response.data.director = response.data?.director._id;
      setMovie(response.data);
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response;
      if (params?.id) {
        response = await UpdateMovie(params.id, values);
      } else {
        response = await AddMovie(values);
      }
      message.success(response.message);
      dispatch(SetLoading(false));
      navigate("/admin");
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  const imageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      dispatch(SetLoading(true));
      const response = await UploadImage(formData);
      if (response.success) {
        const response2 = await UpdateMovie(movie._id, {
          ...movie,
          posters: [...(movie?.posters || []), response.data],
        });
        setMovie(response2.data);
        setFile(null);
      }
      dispatch(SetLoading(false));
      message.success(response.message);
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const deleteImage = async (image) => {
    try {
      dispatch(SetLoading(true));
      const response = await UpdateMovie(movie._id, {
        ...movie,
        posters: movie?.posters?.filter((item) => item !== image),
      });
      dispatch(SetLoading(false));
      message.success(response.message);
      setMovie(response.data);
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getArtists();
  }, []);

  useEffect(() => {
    if (params?.id) {
      getMovie(params.id);
    }
  }, []);

  return (
    (movie || !params.id) && (
      <div>
        <h1 className="text-gray-600 text-xl font-semibold">
          {params?.id ? "Edit Movie" : "Add Movie"}
        </h1>
        <Tabs>
          <Tabs.TabPane tab="Details" key="1">
            <Form
              layout="vertical"
              className="flex flex-col gap-5"
              onFinish={onFinish}
              initialValues={movie}
            >
              <div className="grid grid-cols-3 gap-5">
                <Form.Item
                  label="Name"
                  name="name"
                  rules={antValidationError}
                  className="col-span-2"
                >
                  <input />
                </Form.Item>
                <Form.Item
                  label="Release Date"
                  name="releaseDate"
                  rules={antValidationError}
                >
                  <input type="date" />
                </Form.Item>
              </div>

              <Form.Item label="Plot" name="plot" rules={antValidationError}>
                <textarea />
              </Form.Item>

              <div className="grid grid-cols-3 gap-5">
                <Form.Item label="Hero" name="hero" rules={antValidationError}>
                  <Select options={artists} showSearch />
                </Form.Item>

                <Form.Item
                  label="Heroine"
                  name="heroine"
                  rules={antValidationError}
                >
                  <Select options={artists} showSearch />
                </Form.Item>

                <Form.Item
                  label="Director"
                  name="director"
                  rules={antValidationError}
                >
                  <Select options={artists} showSearch />
                </Form.Item>
              </div>

              <div className="grid grid-cols-3 gap-5">
                <Form.Item
                  label="Genre"
                  name="genre"
                  rules={antValidationError}
                >
                  <Select
                    options={[
                      {
                        label: "Action",
                        value: "action",
                      },
                      {
                        label: "Comedy",
                        value: "comedy",
                      },
                      {
                        label: "Drama",
                        value: "drama",
                      },
                      {
                        label: "Horror",
                        value: "horror",
                      },
                      {
                        label: "Romance",
                        value: "romance",
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Language"
                  name="language"
                  rules={antValidationError}
                >
                  <Select
                    options={[
                      {
                        label: "Telugu",
                        value: "telugu",
                      },
                      {
                        label: "English",
                        value: "english",
                      },
                      {
                        label: "Hindi",
                        value: "hindi",
                      },
                      {
                        label: "Kannada",
                        value: "kannada",
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item
                  label="Trailer"
                  name="trailer"
                  rules={antValidationError}
                >
                  <input type="text" />
                </Form.Item>
              </div>

              <Form.Item label="Cast & Crew" name="cast">
                <Select options={artists} mode="tags" />
              </Form.Item>

              <div className="flex justify-end gap-5">
                <Button
                  onClick={() => {
                    navigate("/admin");
                  }}
                >
                  Cancel
                </Button>
                <Button htmlType="submit" type="primary">
                  save
                </Button>
              </div>
            </Form>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Images" key="2" disabled={!movie}>
            <div className="flex flex-wrap gap-5 mb-10">
              {movie?.posters?.map((image) => (
                <div
                  key={image}
                  className="flex gap-5 border border-dashed p-3"
                >
                  <img src={image} alt="" className="w-20 h-20 object-cover" />
                  <i
                    className="ri-delete-bin-line"
                    onClick={() => {
                      deleteImage(image);
                    }}
                  ></i>
                </div>
              ))}
            </div>

            <Upload
              onChange={(info) => {
                setFile(info.file);
              }}
              beforeUpload={() => false}
              listType="picture"
            >
              <Button>Click to Upload</Button>
            </Upload>

            <div className="flex justify-end gap-5 mt-5">
              <Button
                onClick={() => {
                  navigate("/admin");
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  imageUpload();
                }}
              >
                Upload Now
              </Button>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </div>
    )
  );
}

export default MovieForm;

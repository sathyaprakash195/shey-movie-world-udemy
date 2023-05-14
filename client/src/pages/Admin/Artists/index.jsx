import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Table, message } from "antd";
import ArtistForm from "./ArtistForm";
import { useDispatch } from "react-redux";
import { SetLoading } from "../../../redux/loadersSlice";
import { DeleteArtist, GetAllArtists } from "../../../apis/artists";
import { getDateFormat, getDateTimeFormat } from "../../../helpers";

function Artists() {
  const [artists, setArtists] = React.useState([]);
  const dispatch = useDispatch();
  const [showArtsistForm, setShowArtistForm] = React.useState(false);
  const navigate = useNavigate();
  const [selectedArtist, setSelectedArtist] = React.useState(null);

  const fetchArtists = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllArtists();
      setArtists(response.data);
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const deleteArtist = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteArtist(id);
      message.success(response.message);
      fetchArtists();
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const columns = [
    {
      title: "Artist",
      dataIndex: "profile",
      render: (text, record) => {
        const imageUrl = record?.images?.[0] || "";
        return <img src={imageUrl} alt="" className="w-20 h-20 rounded" />;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "DOB",
      dataIndex: "dob",
      render: (text, record) => {
        return getDateFormat(text);
      },
    },
    {
      title: "Debut Year",
      dataIndex: "debutYear",
    },
    {
      title: "Profession",
      dataIndex: "proffession",
    },
    {
      title: "Debut Movie",
      dataIndex: "debutMovie",
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
                deleteArtist(record._id);
              }}
            ></i>
            <i
              className="ri-pencil-line"
              onClick={() => {
                setSelectedArtist(record);
                setShowArtistForm(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

  React.useEffect(() => {
    fetchArtists();
  }, []);

  return (
    <div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedArtist(null);
            setShowArtistForm(true);
          }}
        >
          Add Artist
        </Button>
      </div>

      <Table dataSource={artists} columns={columns} className="mt-5" />

      {showArtsistForm && (
        <ArtistForm
          showArtistForm={showArtsistForm}
          setShowArtistForm={setShowArtistForm}
          selectedArtist={selectedArtist}
          setSelectedArtist={setSelectedArtist}
          reloadData={fetchArtists}
        />
      )}
    </div>
  );
}

export default Artists;

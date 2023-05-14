import { Button, Form, Input, Modal, Tabs, Upload, message } from "antd";
import React from "react";
import { antValidationError } from "../../../helpers";
import { useDispatch } from "react-redux";
import { AddArtist, UpdateArtist } from "../../../apis/artists";
import { SetLoading } from "../../../redux/loadersSlice";
import moment from "moment";
import { UploadImage } from "../../../apis/images";

function ArtistForm({
  showArtistForm,
  setShowArtistForm,
  selectedArtist,
  reloadData,
  setSelectedArtist,
}) {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = React.useState("1");
  const [file, setFile] = React.useState(null);
  const [form] = Form.useForm();
  if (selectedArtist) {
    selectedArtist.dob = moment(selectedArtist.dob).format("YYYY-MM-DD");
  }

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response;
      if (selectedArtist) {
        response = await UpdateArtist(selectedArtist._id, values);
      } else {
        response = await AddArtist(values);
      }
      reloadData();
      dispatch(SetLoading(false));
      message.success(response.message);
      setShowArtistForm(false);
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const imageUpload = async () => {
    try {
      const formData = new FormData();
      formData.append("image", file);
      dispatch(SetLoading(true));
      const response = await UploadImage(formData);
      if (response.success) {
        const response2 = await UpdateArtist(selectedArtist._id, {
          ...selectedArtist,
          images: [...(selectedArtist?.images || []), response.data],
        });
        setSelectedArtist(response2.data);
      }
      reloadData();
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
      const response = await UpdateArtist(selectedArtist._id, {
        ...selectedArtist,
        images: selectedArtist?.images?.filter((item) => item !== image),
      });
      setSelectedArtist(response.data);
      reloadData();
      dispatch(SetLoading(false));
      message.success(response.message);
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  return (
    <Modal
      open={showArtistForm}
      onCancel={() => setShowArtistForm(false)}
      title=""
      centered
      width={800}
      okText={selectedArtist ? "Update" : "Add"}
      onOk={() => {
        if (selectedTab === "1") {
          form.submit();
        } else {
          imageUpload();
        }
      }}
    >
      <>
        <div className="h1 text-center font-semibold text-gray-600 text-xl uppercase">
          {selectedArtist ? "Update" : "Add"} Artist
        </div>
        <Tabs defaultActiveKey="1" onChange={(key) => setSelectedTab(key)}>
          <Tabs.TabPane tab="Basic Info" key="1">
            <Form
              layout="vertical"
              className="flex flex-col gap-5"
              onFinish={onFinish}
              form={form}
              initialValues={selectedArtist}
            >
              <Form.Item label="Name" name="name" rules={antValidationError}>
                <Input />
              </Form.Item>
              <div className="grid grid-cols-2 gap-5">
                <Form.Item label="DOB" name="dob" rules={antValidationError}>
                  <Input type="date" />
                </Form.Item>
                <Form.Item
                  label="Debut Year"
                  name="debutYear"
                  rules={antValidationError}
                >
                  <Input type="number" />
                </Form.Item>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Form.Item
                  label="Profession"
                  name="proffession"
                  rules={antValidationError}
                >
                  <select>
                    <option value="">Select</option>
                    <option value="Actor">Actor</option>
                    <option value="Actress">Actress</option>
                    <option value="Director">Director</option>
                    <option value="Producer">Producer</option>
                    <option value="Music Director">Music Director</option>
                    <option value="Singer">Singer</option>
                    <option value="Lyricist">Lyricist</option>
                    <option value="Cinematographer">Cinematographer</option>
                    <option value="Editor">Editor</option>
                  </select>
                </Form.Item>
                <Form.Item
                  label="Debut Movie"
                  name="debutMovie"
                  rules={antValidationError}
                >
                  <Input type="text" />
                </Form.Item>
              </div>

              <Form.Item label="Bio" name="bio" rules={antValidationError}>
                <Input.TextArea />
              </Form.Item>
            </Form>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Images" key="2" disabled={!selectedArtist}>
            <div className="flex flex-wrap gap-5 mb-10">
              {selectedArtist?.images?.map((image) => (
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
          </Tabs.TabPane>
        </Tabs>
      </>
    </Modal>
  );
}

export default ArtistForm;

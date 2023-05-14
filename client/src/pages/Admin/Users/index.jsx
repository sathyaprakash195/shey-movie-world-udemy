import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SetLoading } from "../../../redux/loadersSlice";
import { GetAllUsers, UpdateUser } from "../../../apis/users";
import { Switch, Table, message } from "antd";
import { getDateTimeFormat } from "../../../helpers";

function Users() {
  const [users, setUsers] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getUsers = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllUsers();
      setUsers(response.data);
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const updateUser = async (user) => {
    try {
      dispatch(SetLoading(true));
      const response = await UpdateUser(user);
      message.success(response.message);
      getUsers();
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => getDateTimeFormat(text),
    },
    {
      title: "Is Admin",
      dataIndex: "isAdmin",
      render: (text, user) => (
        <Switch
          checked={text}
          onChange={(checked) => updateUser({ ...user, isAdmin: checked })}
        />
      ),
    },
    {
      title: "Is Active",
      dataIndex: "isActive",
      render: (text, user) => (
        <Switch
          checked={text}
          onChange={(checked) => updateUser({ ...user, isActive: checked })}
        />
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={users} columns={columns} />
    </div>
  );
}

export default Users;

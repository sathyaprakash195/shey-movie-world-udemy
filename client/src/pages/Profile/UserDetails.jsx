import { Button, Form, message } from "antd";
import React, { useState } from "react";
import { antValidationError } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { UpdateUser } from "../../apis/users";

import { SetUser } from "../../redux/usersSlice";

function UserDetails() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      const response = await UpdateUser({
        ...values,
        _id: user._id,
      });
      message.success(response.message);
      dispatch(SetUser(response.data));
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div>
      <Form
        layout="vertical"
        className="flex flex-col gap-5 mt-3 w-96"
        onFinish={onFinish}
        initialValues={{
          name: user.name,
          email: user.email,
        }}
      >
        <Form.Item label="Name" name="name" rules={antValidationError}>
          <input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={antValidationError}>
          <input />
        </Form.Item>
        <Form.Item
          label="Old Password"
          name="oldPassword"
          rules={antValidationError}
        >
          <input type="password" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="newPassword"
          rules={antValidationError}
        >
          <input type="password" />
        </Form.Item>

        <div className="flex flex-col gap-5">
          <Button type="primary" htmlType="submit" block>
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
}

export default UserDetails;

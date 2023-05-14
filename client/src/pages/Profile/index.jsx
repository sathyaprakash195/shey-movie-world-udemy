import React from "react";
import { Tabs } from "antd";
import Reviews from "./Reviews";
import UserDetails from "./UserDetails";

function Profile() {
  return (
    <Tabs defaultActiveKey="1">
      <Tabs.TabPane tab="Reviews" key="1">
         <Reviews />
      </Tabs.TabPane>
      <Tabs.TabPane tab="Profile" key="2">
        <UserDetails />
      </Tabs.TabPane>
    </Tabs>
  );
}

export default Profile;

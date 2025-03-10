import React from "react";
import "./AdminHeader.css";
import { IoNotificationsSharp } from "react-icons/io5";
import default_avatar from "../../../assets/default_avatar.png";

const AdminHeader = () => {
  return (
    <div className="admin-header">
      <div className="header-right">
        <div className="notification-icon">
          <span className="icon">
            <IoNotificationsSharp />
          </span>
        </div>
        <div className="user-profile">
          <div className="avatar">
            <img src={default_avatar} alt="User avatar" />
          </div>
          <div className="user-info">
            <div className="user-name">Nguyễn Hoàng Nghĩa</div>
            <div className="user-role">Administrator</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
import React from "react";
import "./Sidebar.css";
import { FiHome } from "react-icons/fi";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { FaRegComments } from "react-icons/fa";
import { LuTag } from "react-icons/lu";
import { RiErrorWarningLine } from "react-icons/ri";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";
const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>Thống kê</h3>
        <div className="sidebar-item active">
          <span className="icon">
            <FiHome />
          </span>
          <span>Dashboard</span>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Nội dung</h3>
        <div className="sidebar-item">
          <span className="icon">
            <PiPencilSimpleLineBold />
          </span>
          <span>Bài viết</span>
        </div>
        <div className="sidebar-item">
          <span className="icon">
            <FaRegComments />
          </span>
          <span>Bình luận</span>
        </div>
        <div className="sidebar-item">
          <span className="icon">
            <LuTag />
          </span>
          <span>Danh mục</span>
        </div>
        <div className="sidebar-item">
          <span className="icon">
            <RiErrorWarningLine />
          </span>
          <span>Báo cáo</span>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Quản trị</h3>
        <div className="sidebar-item">
          <span className="icon">
            <MdOutlinePeopleAlt />
          </span>
          <span>Người dùng</span>
        </div>
        <div className="sidebar-item">
          <span className="icon">
            <RiSettings3Line />
          </span>
          <span>Cấu hình</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

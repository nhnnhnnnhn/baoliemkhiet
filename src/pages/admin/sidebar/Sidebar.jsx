import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Sidebar.css";
import { FiHome } from "react-icons/fi";
import { PiPencilSimpleLineBold } from "react-icons/pi";
import { FaRegComments } from "react-icons/fa";
import { LuTag } from "react-icons/lu";
import { RiErrorWarningLine } from "react-icons/ri";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { RiSettings3Line } from "react-icons/ri";

const Sidebar = () => {
  const location = useLocation();

  // Get the current active item based on the URL path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === "/admin/dashboard") return "Dashboard";
    if (path === "/admin/dashboard/posts") return "Bài viết";
    if (path === "/admin/dashboard/comments") return "Bình luận";
    if (path === "/admin/dashboard/categories") return "Danh mục";
    if (path === "/admin/dashboard/reports") return "Báo cáo";
    if (path === "/admin/dashboard/users") return "Người dùng";
    if (path === "/admin/dashboard/settings") return "Cấu hình";
    return "Dashboard"; // Default
  };

  const [activeItem, setActiveItem] = useState(getActiveItem());

  // Function to handle click on sidebar items
  const handleItemClick = (itemName) => {
    setActiveItem(itemName);
    console.log(`Clicked on: ${itemName}`);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-section">
        <h3>Thống kê</h3>
        <Link
          to="/admin/dashboard"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            className={`sidebar-item ${
              activeItem === "Dashboard" ? "active" : ""
            }`}
            onClick={() => handleItemClick("Dashboard")}
          >
            <span className="icon">
              <FiHome />
            </span>
            <span>Dashboard</span>
          </div>
        </Link>
      </div>
      <div className="sidebar-section">
        <h3>Nội dung</h3>
        <Link
          to="/admin/posts"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            className={`sidebar-item ${
              activeItem === "Bài viết" ? "active" : ""
            }`}
            onClick={() => handleItemClick("Bài viết")}
          >
            <span className="icon">
              <PiPencilSimpleLineBold />
            </span>
            <span>Bài viết</span>
          </div>
        </Link>
        <Link
          to="/admin/dashboard/comments"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            className={`sidebar-item ${
              activeItem === "Bình luận" ? "active" : ""
            }`}
            onClick={() => handleItemClick("Bình luận")}
          >
            <span className="icon">
              <FaRegComments />
            </span>
            <span>Bình luận</span>
          </div>
        </Link>
        <Link
          to="/admin/dashboard/categories"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            className={`sidebar-item ${
              activeItem === "Danh mục" ? "active" : ""
            }`}
            onClick={() => handleItemClick("Danh mục")}
          >
            <span className="icon">
              <LuTag />
            </span>
            <span>Danh mục</span>
          </div>
        </Link>
        <Link
          to="/admin/dashboard/reports"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            className={`sidebar-item ${
              activeItem === "Báo cáo" ? "active" : ""
            }`}
            onClick={() => handleItemClick("Báo cáo")}
          >
            <span className="icon">
              <RiErrorWarningLine />
            </span>
            <span>Báo cáo</span>
          </div>
        </Link>
      </div>
      <div className="sidebar-section">
        <h3>Quản trị</h3>
        <Link
          to="/admin/dashboard/users"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            className={`sidebar-item ${
              activeItem === "Người dùng" ? "active" : ""
            }`}
            onClick={() => handleItemClick("Người dùng")}
          >
            <span className="icon">
              <MdOutlinePeopleAlt />
            </span>
            <span>Người dùng</span>
          </div>
        </Link>
        <Link
          to="/admin/dashboard/settings"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            className={`sidebar-item ${
              activeItem === "Cấu hình" ? "active" : ""
            }`}
            onClick={() => handleItemClick("Cấu hình")}
          >
            <span className="icon">
              <RiSettings3Line />
            </span>
            <span>Cấu hình</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;

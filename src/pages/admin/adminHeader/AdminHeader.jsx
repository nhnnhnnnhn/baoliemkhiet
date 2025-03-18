import React, { useState, useRef, useEffect, useContext } from "react";
import "./AdminHeader.css";
import { IoNotificationsSharp } from "react-icons/io5";
import { AuthContext } from "../../../contexts/AuthContext"; // Make sure this path is correct
import default_avatar from "../../../assets/default_avatar.png";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const { user, logout } = useContext(AuthContext);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const navigate = useNavigate();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleSignOut = () => {
    setShowPopup(false);
    logout(); // Using the logout function from AuthContext
    navigate("/admin/login"); // Redirect to login page
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="admin-header">
      <div className="header-right">
        <div className="notification-icon">
          <span className="icon">
            <IoNotificationsSharp />
          </span>
        </div>
        <div className="user-profile">
          <div className="profile-container" onClick={togglePopup}>
            <div className="avatar">
              <img src={default_avatar} alt="User avatar" />
            </div>
            <div className="user-info">
              <div className="user-name">
                {user
                  ? user.name || "Nguyễn Hoàng Nghĩa"
                  : "Nguyễn Hoàng Nghĩa"}
              </div>
              <div className="user-role">Administrator</div>
            </div>
          </div>

          {showPopup && (
            <div className="sign-out-popup" ref={popupRef}>
              <div className="popup-item" onClick={handleSignOut}>
                <span>Đăng xuất</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

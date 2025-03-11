import React, { useState, useEffect } from "react";
import { FiSearch, FiCalendar, FiFilter, FiPlus } from "react-icons/fi";
import "./Users.css";

const Users = () => {
  // Sample data for demonstration
  const [users, setUsers] = useState([
    {
      id: "kienpham0607",
      name: "Kiên",
      role: "Nhà báo",
      email: "kienpham0607@gmail.com",
      date: "03/03/2025",
      status: "online",
    },
    {
      id: "trung123",
      name: "Trung",
      role: "Nhà báo",
      email: "",
      date: "",
      status: "offline",
    },
    {
      id: "nhat456",
      name: "Nhật",
      role: "Quản trị viên",
      email: "",
      date: "",
      status: "online",
    },
    {
      id: "huy789",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "online",
    },
    {
      id: "huy791",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "offline",
    },
    {
      id: "huy792",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "online",
    },
    {
      id: "huy793",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "offline",
    },
    {
      id: "huy794",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "offline",
    },
    {
      id: "huy795",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "offline",
    },
    {
      id: "huy796",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "online",
    },
    {
      id: "huy797",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "online",
    },
    {
      id: "huy798",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "online",
    },
    {
      id: "huy799",
      name: "Huy",
      role: "Người dùng",
      email: "",
      date: "",
      status: "offline",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    role: "Người dùng",
    email: "",
    date: new Date().toISOString().split("T")[0],
    status: "Đang hoạt động",
  });

  // Get unique roles for the dropdown
  const roles = ["Tất cả", ...new Set(users.map((user) => user.role))];

  // Filter users based on search, role, and date
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesRole =
      selectedRole === "" ||
      selectedRole === "Tất cả" ||
      user.role === selectedRole;

    const matchesDate = selectedDate === "" || user.date === selectedDate;

    return matchesSearch && matchesRole && matchesDate;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle role selection
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  // Handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Handle new user form inputs
  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  // Add new user
  const handleAddUser = () => {
    if (newUser.id && newUser.name) {
      setUsers([...users, { ...newUser }]);
      setNewUser({
        id: "",
        name: "",
        role: "Người dùng",
        email: "",
        date: new Date().toISOString().split("T")[0],
        status: "offline",
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="user-container">
      <h1>Người dùng</h1>

      {/* Filters section */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="search-button">
            <FiSearch />
          </button>
        </div>

        <div className="role-filter">
          <select value={selectedRole} onChange={handleRoleChange}>
            {roles.map((role, index) => (
              <option key={index} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div className="date-filter">
          <input type="date" value={selectedDate} onChange={handleDateChange} />
          <FiCalendar className="calendar-icon" />
        </div>

        <button className="filter-button">
          <FiFilter /> Lọc
        </button>

        <button className="add-button" onClick={() => setShowAddForm(true)}>
          <FiPlus /> Thêm người dùng
        </button>
      </div>

      {/* User table */}
      <div className="user-table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>ID người dùng</th>
              <th>Tên</th>
              <th>Vai trò</th>
              <th>Email</th>
              <th>Ngày</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.email}</td>
                <td>{user.date}</td>
                <td>
                  <span
                    className={`status-badge ${user.status
                      .toLowerCase()
                      .replace(" ", "-")}`}
                  >
                    {user.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add user form */}
      {showAddForm && (
        <div className="add-user-overlay">
          <div className="add-user-form">
            <h2>Thêm người dùng mới</h2>
            <div className="form-group">
              <label>ID người dùng</label>
              <input
                type="text"
                name="id"
                value={newUser.id}
                onChange={handleNewUserChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Tên</label>
              <input
                type="text"
                name="name"
                value={newUser.name}
                onChange={handleNewUserChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Vai trò</label>
              <select
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
              >
                <option value="Người dùng">Người dùng</option>
                <option value="Nhà báo">Nhà báo</option>
                <option value="Quản trị viên">Quản trị viên</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={newUser.email}
                onChange={handleNewUserChange}
              />
            </div>
            <div className="form-actions">
              <button
                className="cancel-button"
                onClick={() => setShowAddForm(false)}
              >
                Hủy bỏ
              </button>
              <button className="save-button" onClick={handleAddUser}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

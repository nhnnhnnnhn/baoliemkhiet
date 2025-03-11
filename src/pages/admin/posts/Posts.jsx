import React, { useState, useEffect } from "react";
import "./Posts.css";
import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";

const Posts = () => {
  // Sample data for demonstration
  const [posts, setPosts] = useState([
    {
      id: 1,
      title:
        "Vụ vây bắt 4 anh: Chàng trai Sunshine là người được cư dân mạng hộ phục nhất",
      category: "Phốt",
      status: "Từ chối",
      image: "/images/post1.jpg",
      date: "2025-03-01",
    },
    {
      id: 2,
      title:
        "Tân canh Đà Vũng Tàu: Vừa mới nổi đã diện phối gà gái, tưởng học bài ai ngờ trái họ",
      category: "Phốt",
      status: "Đã duyệt",
      image: "/images/post2.jpg",
      date: "2025-03-05",
    },
    {
      id: 3,
      title: "MacBook Air 2025 ra mắt với chip M4, giá rẻ hơn",
      category: "Công nghệ",
      status: "Chỉnh sửa",
      image: "/images/post3.jpg",
      date: "2025-03-08",
    },
    {
      id: 4,
      title: "Canada, Trung Quốc áp thuế trả đũa Mỹ",
      category: "Kinh tế",
      status: "Đã duyệt",
      image: "/images/post4.jpg",
      date: "2025-03-10",
    },
  ]);

  const [recentlyApproved, setRecentlyApproved] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Categories for dropdown
  const categories = [
    "Tất cả",
    "Phốt",
    "Công nghệ",
    "Kinh tế",
    "Giáo dục",
    "Thể thao",
  ];

  // Filter posts based on search, category, and date
  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "" ||
      selectedCategory === "Tất cả" ||
      post.category === selectedCategory;
    const matchesDate = selectedDate === "" || post.date === selectedDate;
    return matchesSearch && matchesCategory && matchesDate;
  });

  // Get recently approved posts
  useEffect(() => {
    const approved = posts.filter((post) => post.status === "Đã duyệt");
    setRecentlyApproved(approved.slice(0, 5)); // Get latest 5
  }, [posts]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Function to handle post status change
  const handleStatusChange = (id, newStatus) => {
    setPosts(
      posts.map((post) =>
        post.id === id ? { ...post, status: newStatus } : post
      )
    );
  };

  return (
    <div className="posts-container">
      <h1>Bài viết</h1>

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

        <div className="category-filter">
          <select value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
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
      </div>

      {/* Two-column layout for content */}
      <div className="content-layout">
        {/* Main posts table */}
        <div className="posts-table-container">
          <h2>Tất cả bài viết</h2>
          <table className="posts-table">
            <thead>
              <tr>
                <th width="60%">Bài viết</th>
                <th width="20%">Danh mục</th>
                <th width="20%">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <tr key={post.id}>
                  <td className="post-info">
                    <div className="post-thumbnail">
                      <img src={post.image} alt={post.title} />
                    </div>
                    <div className="post-title">{post.title}</div>
                  </td>
                  <td>{post.category}</td>
                  <td>
                    <span
                      className={`status-badge ${post.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {post.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recently approved posts */}
        <div className="recently-approved">
          <h2>Bài viết đã duyệt gần đây</h2>
          <div className="approved-posts-list">
            {recentlyApproved.map((post) => (
              <div key={post.id} className="approved-post-card">
                <div className="approved-post-thumbnail">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="approved-post-details">
                  <h3>{post.title}</h3>
                  <div className="post-metadata">
                    <span className="post-category">{post.category}</span>
                    <span className="post-date">{post.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;

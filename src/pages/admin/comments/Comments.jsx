import React, { useState, useEffect } from "react";
import "./Comments.css";
import { FiSearch, FiCalendar, FiFilter } from "react-icons/fi";

const Comments = () => {
  // Sample data for demonstration
  const [comments, setComments] = useState([
    {
      id: 1,
      content: "Đúng là tưởng học bài, ai ngờ lại làm chuyện đó!",
      author: "Kiên",
      postTitle:
        "Tân canh Đà Vũng Tàu: Vừa mới nổi đã diện phối gà gái, tưởng học bài ai ngờ trái họ",
      status: "Đã duyệt",
      date: "2025-03-03",
    },
    {
      id: 2,
      content: "Tôi thấy câu chuyện này cần được điều tra kỹ hơn",
      author: "Minh Tuấn",
      postTitle:
        "Vụ vây bắt 4 anh: Chàng trai Sunshine là người được cư dân mạng hộ phục nhất",
      status: "Từ chối",
      date: "2025-03-04",
    },
    {
      id: 3,
      content: "MacBook Air mới có thật sự đáng tiền không?",
      author: "Hương Giang",
      postTitle: "MacBook Air 2025 ra mắt với chip M4, giá rẻ hơn",
      status: "Chờ duyệt",
      date: "2025-03-09",
    },
    {
      id: 4,
      content: "Việt Nam sẽ chịu ảnh hưởng thế nào từ cuộc chiến thuế này?",
      author: "Đức Anh",
      postTitle: "Canada, Trung Quốc áp thuế trả đũa Mỹ",
      status: "Đã duyệt",
      date: "2025-03-11",
    },
  ]);

  const [recentlyApproved, setRecentlyApproved] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  // Get unique authors for dropdown
  const authors = [
    "Tất cả",
    ...new Set(comments.map((comment) => comment.author)),
  ];

  // Filter comments based on search, author, and date
  const filteredComments = comments.filter((comment) => {
    const matchesSearch = comment.content
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesAuthor =
      selectedAuthor === "" ||
      selectedAuthor === "Tất cả" ||
      comment.author === selectedAuthor;
    const matchesDate = selectedDate === "" || comment.date === selectedDate;
    return matchesSearch && matchesAuthor && matchesDate;
  });

  // Get recently approved comments
  useEffect(() => {
    const approved = comments.filter(
      (comment) => comment.status === "Đã duyệt"
    );
    setRecentlyApproved(approved.slice(0, 5)); // Get latest 5
  }, [comments]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle author selection
  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
  };

  // Handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  // Function to handle comment status change
  const handleStatusChange = (id, newStatus) => {
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, status: newStatus } : comment
      )
    );
  };

  return (
    <div className="comments-container">
      <h1>Bình luận</h1>

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

        <div className="author-filter">
          <select value={selectedAuthor} onChange={handleAuthorChange}>
            {authors.map((author, index) => (
              <option key={index} value={author}>
                {author}
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
        {/* Main comments table */}
        <div className="comments-table-container">
          <h2>Tất cả bình luận</h2>
          <table className="comments-table">
            <thead>
              <tr>
                <th width="20%">Tác giả</th>
                <th width="40%">Bình luận</th>
                <th width="20%">Bài viết</th>
                <th width="10%">Ngày</th>
                <th width="10%">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredComments.map((comment) => (
                <tr key={comment.id}>
                  <td>{comment.author}</td>
                  <td className="comment-content">{comment.content}</td>
                  <td className="post-title-cell">{comment.postTitle}</td>
                  <td>{comment.date}</td>
                  <td>
                    <span
                      className={`status-badge ${comment.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {comment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recently approved comments */}
        <div className="recently-approved">
          <h2>Bình luận đã duyệt gần đây</h2>
          <div className="approved-comments-list">
            {recentlyApproved.map((comment) => (
              <div key={comment.id} className="approved-comment-card">
                <div className="comment-header">
                  <span className="comment-author">{comment.author}</span>
                  <span className="comment-date">{comment.date}</span>
                </div>
                <div className="comment-body">
                  <p>{comment.content}</p>
                </div>
                <div className="comment-footer">
                  <span className="related-post">
                    Bài viết: {comment.postTitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;

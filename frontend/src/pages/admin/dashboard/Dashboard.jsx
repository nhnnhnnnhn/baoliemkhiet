import React from "react";
import "./Dashboard.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import barca from "../../../assets/barca.png";
import mu from "../../../assets/mu.png";
import antony from "../../../assets/antony.png";
import daumat from "../../../assets/daumat.png";

const Dashboard = () => {
  // Sample data for the dashboard
  const viewsData = [
    { day: "T2", views: 95000 },
    { day: "T3", views: 92000 },
    { day: "T4", views: 98000 },
    { day: "T5", views: 97000 },
    { day: "T6", views: 99000 },
    { day: "T7", views: 93000 },
    { day: "CN", views: 100000 },
  ];

  const trendingPosts = [
    {
      id: 1,
      title: "Điều gì ngăn cản Barca vô địch C1 năm nay?",
      views: 15420,
      comments: 324,
      image: barca,
    },
    {
      id: 2,
      title: "Vấn đề của Manchester United là gì?",
      views: 12350,
      comments: 287,
      image: mu,
    },
    {
      id: 3,
      title: "Top 10 cầu thủ xuất sắc nhất mùa giải",
      views: 10280,
      comments: 198,
      image: antony,
    },
    {
      id: 4,
      title: "Đánh giá về giải Ngoại hạng Anh mùa này",
      views: 9870,
      comments: 175,
      image: daumat,
    },
  ];

  return (
    <div className="dashboard">
      <h1>Welcome, Nguyễn Hoàng Nghĩa!</h1>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Lượt xem trong ngày</h3>
          <div className="stat-value">100,000</div>
          <div className="stat-change negative">-2.9% so với ngày hôm qua</div>
        </div>

        <div className="stat-card">
          <h3>Bài đăng trong ngày</h3>
          <div className="stat-value">15</div>
          <div className="stat-change positive">+25.0% so với ngày hôm qua</div>
        </div>

        <div className="stat-card">
          <h3>Bình luận</h3>
          <div className="stat-value">230</div>
          <div className="stat-change positive">+73.2% so với ngày hôm qua</div>
        </div>
      </div>

      <div className="dashboard-row">
        <div className="trending-posts-compact">
          <h2>Bài viết nổi bật</h2>
          <div className="compact-posts-list">
            {trendingPosts.map((post) => (
              <div className="compact-post-item" key={post.id}>
                <div className="post-image">
                  <img
                    src={post.image}
                    alt={post.title}
                    style={{
                      marginTop: "30px",
                      width: "100%",
                      height: "auto",
                      maxWidth: "120px",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <div className="post-stats">
                    <span>{post.views.toLocaleString()} lượt xem</span>
                    <span>{post.comments} bình luận</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-container">
          <h2>Lượt xem theo ngày</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={viewsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

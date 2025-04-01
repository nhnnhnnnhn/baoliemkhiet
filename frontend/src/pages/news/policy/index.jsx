import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./PolicyDetail.css";

// Dữ liệu mẫu cho tin liên quan
const relatedNewsData = [
  {
    id: 1,
    title: "Real Madrid tức giận vì huỷ bỏ thẻ đỏ của anh Long",
    summary: "Đội bóng hoàng gia đã bày tỏ sự không hài lòng với quyết định của trọng tài.",
    image: "/assets/sport/sreal.png",
    link: "/sport"
  },
  {
    id: 2,
    title: "Messi trở lại Barcelona?",
    summary: "Nhiều nguồn tin cho rằng siêu sao người Argentina đang cân nhắc quay trở lại câu lạc bộ cũ.",
    image: "/assets/sport/messi.png",
    link: "/sport"
  },
  {
    id: 3,
    title: "PSG VS LIVERPOOL: Sút 27 quả rồi thua vì có Alisson Becker ở đó",
    summary: "Đội bóng Pháp đã không thể ghi bàn dù tạo ra rất nhiều cơ hội.",
    image: "/assets/sport/psgliver.png",
    link: "/sport"
  }
];

// Dữ liệu mẫu cho bình luận
const commentsData = [
  {
    id: 1,
    author: "Nguyễn Văn A",
    date: "28/02/2024 - 15:30",
    content: "Việc sửa đổi Điều lệ Đảng và Hiến pháp là cần thiết để phù hợp với tình hình mới."
  },
  {
    id: 2,
    author: "Trần Thị B",
    date: "28/02/2024 - 16:45",
    content: "Tôi quan tâm đến việc sửa đổi Luật Cán bộ, công chức. Hy vọng sẽ có những điều chỉnh tích cực."
  },
  {
    id: 3,
    author: "Lê Văn C",
    date: "29/02/2024 - 08:20",
    content: "Hiến pháp 2013 đã có nhiều điểm tiến bộ, nhưng vẫn cần sửa đổi để hoàn thiện hơn nữa hệ thống pháp luật của chúng ta."
  }
];

const PolicyDetail = () => {
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(commentsData);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCommentChange = (e) => {
    setCommentText(e.target.value);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") return;

    const newComment = {
      id: comments.length + 1,
      author: "Người dùng",
      date: new Date().toLocaleDateString("vi-VN") + " - " + new Date().toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }),
      content: commentText
    };

    setComments([newComment, ...comments]);
    setCommentText("");
  };

  return (
    <div className="policy-detail-container">
      <h1 className="policy-detail-title">
        Sẽ trình Trung ương đề xuất sửa Điều lệ Đảng và Hiến pháp
      </h1>
      
      <div className="policy-detail-summary">
        Bộ Chính trị, Ban Bí thư giao các cơ quan rà soát, đề xuất sửa đổi Điều lệ Đảng và Hiến pháp liên quan đến kiểm tra giám sát và tổ chức bộ máy của hệ thống chính trị.
      </div>
      
      <div className="policy-detail-content">
        <p>
          Theo kết luận 127 ban hành ngày 28/2, Bộ Chính trị, Ban Bí thư giao Ban Tổ chức Trung ương, Ủy ban Kiểm tra Trung ương, Đảng ủy các cơ quan Đảng Trung ương, Đảng ủy Chính phủ, Đảng ủy Quốc hội, Đảng ủy Mặt trận Tổ quốc, đoàn thể Trung ương và cơ quan liên quan trong quá trình chuẩn bị các đề án, chủ động rà soát, đề xuất sửa đổi, bổ sung Điều lệ Đảng, Quy định về thi hành Điều lệ Đảng.
        </p>
        
        <p>
          Nội dung đề xuất sửa đổi gồm: Công tác kiểm tra, giám sát, kỷ luật Đảng; đại hội đảng bộ các cấp; kết thúc hoạt động của đảng bộ cấp huyện. Các quy định, hướng dẫn của Đảng liên quan đến công tác xây dựng Đảng, hệ thống tổ chức Đảng ở địa phương cũng được xem xét sửa đổi. Nội dung này cần báo cáo Bộ Chính trị để trình Ban Chấp hành Trung ương trước 9/4.
        </p>
        
        <img 
          src="/assets/hinh-anh-hoi-nghi-trung-uong.jpg" 
          alt="Hội nghị Ban Chấp hành Trung ương Đảng" 
          className="policy-detail-image"
        />
        <div className="policy-detail-image-caption">
          Hội nghị Ban Chấp hành Trung ương Đảng khóa 13, chiều 23/1. Ảnh: Hoàng Phong
        </div>
        
        <p>
          Đảng ủy Quốc hội được giao chủ trì, phối hợp với Đảng ủy Chính phủ chỉ đạo Đảng ủy Ủy ban Pháp luật và Tư pháp, Đảng ủy Bộ Tư pháp nghiên cứu sửa đổi, bổ sung một số điều của Hiến pháp với phạm vi là các vấn đề về tổ chức bộ máy của hệ thống chính trị. Nội dung này báo cáo Bộ Chính trị đầu tháng 3/2025 để trình Ban Chấp hành Trung ương trước 7/4. Thời gian hoàn thành sửa đổi, bổ sung một số điều của Hiến pháp chậm nhất ngày 30/6.
        </p>
        
        <p>
          Đảng ủy Chính phủ, Đảng ủy Quốc hội chỉ đạo các cơ quan có nhiệm vụ nghiên cứu, đề xuất sửa đổi bổ sung Luật Tổ chức chính quyền địa phương, Luật Cán bộ, công chức, Luật Thanh tra, Luật Quy hoạch, Luật Bầu cử đại biểu Quốc hội và đại biểu HĐND, Luật Ban hành văn bản quy phạm pháp luật, Luật Tổ chức tòa án nhân dân, Luật Tổ chức viện kiểm sát nhân dân, cùng các nghị định về cơ chế, chính sách với cán bộ, công chức, viên chức, người lao động bị ảnh hưởng do sắp xếp đơn vị hành chính ở địa phương và xử lý tài sản nhà nước sau sắp xếp. Nội dung này báo cáo Bộ Chính trị và hoàn thành sửa đổi, bổ sung chậm nhất ngày 30/6.
        </p>
        
        <p>
          Đảng ủy Mặt trận Tổ quốc, các đoàn thể Trung ương được giao nghiên cứu sửa đổi các quy định, hướng dẫn liên quan việc sắp xếp, tinh gọn cơ quan Mặt trận Tổ quốc, tổ chức chính trị - xã hội, các hội quần chúng do Đảng và Nhà nước giao nhiệm vụ. Nội dung này báo cáo Bộ Chính trị, Ban Bí thư và hoàn thành chậm nhất ngày 30/6.
        </p>
        
        <p>
          Điều lệ Đảng là văn bản pháp lý cơ bản của Đảng Cộng sản Việt Nam, xác định tôn chỉ, mục đích, hệ tư tưởng, các nguyên tắc về tổ chức, hoạt động, cơ cấu bộ máy của Đảng; quy định trách nhiệm, nhiệm vụ, quyền hạn của đảng viên và của tổ chức đảng các cấp. Mục đích của việc xây dựng Điều lệ Đảng là thống nhất tư tưởng, tổ chức và hành động trong toàn Đảng, thực hiện mục tiêu của Đảng. Điều lệ Đảng do Đại hội đại biểu toàn quốc của Đảng thông qua và ban hành, yêu cầu mọi tổ chức đảng và đảng viên phải chấp hành.
        </p>
        
        <p>
          Từ khi thành lập nước Việt Nam Dân chủ Cộng hòa, Việt Nam đã có 5 bản Hiến pháp. Hiến pháp năm 2013 quy định phân chia đơn vị hành chính: tỉnh, thành phố trực thuộc Trung ương; tỉnh chia thành huyện, thị xã, thành phố thuộc tỉnh; thành phố trực thuộc trung ương chia thành quận, huyện, thị xã. Huyện chia thành xã, thị trấn; thị xã, thành phố thuộc tỉnh chia thành phường, xã; quận chia thành phường. Đơn vị hành chính - kinh tế đặc biệt do Quốc hội thành lập.
        </p>
      </div>
      
      <div className="policy-detail-author">
        Vũ Tuân
      </div>

      {/* Phần tin liên quan */}
      <div className="related-news">
        <h2 className="related-news-title">Tin liên quan</h2>
        <div className="related-news-grid">
          {relatedNewsData.map(news => (
            <Link to={news.link} key={news.id} className="related-news-item">
              <img src={news.image} alt={news.title} />
              <h3>{news.title}</h3>
              <p>{news.summary}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Phần bình luận */}
      <div className="comments-section">
        <h2 className="comments-title">Bình luận ({comments.length})</h2>
        
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea 
            placeholder="Viết bình luận của bạn..." 
            value={commentText}
            onChange={handleCommentChange}
            required
          />
          <button type="submit">Gửi bình luận</button>
          <div style={{ clear: 'both' }}></div>
        </form>
        
        <div className="comment-list">
          {comments.map(comment => (
            <div key={comment.id} className="comment-item">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{comment.date}</span>
              </div>
              <div className="comment-content">
                {comment.content}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PolicyDetail; 
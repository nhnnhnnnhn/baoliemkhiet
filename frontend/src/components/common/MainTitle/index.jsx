import React from "react";
import { Link } from "react-router-dom";
import "./MainTitle.css";

// Import các hình ảnh
import hotNewsImage from "../../../assets/MainTitle.png";
import newsImage1 from "../../../assets/image1.png";
import newsImage2 from "../../../assets/image2.png";
import newsImage3 from "../../../assets/image3.png";
import newsImage4 from "../../../assets/image4.png";
import anthonyImage from "../../../assets/antony.png";
import husbandImage from "../../../assets/hotnew.png";
import indochaodon from "../../../assets/indochaodon.png";
import asean from "../../../assets/asean.png";
import caotoc from "../../../assets/caotoc.png";
import indo from "../../../assets/indo.jpg";

const MainTitle = () => {
  return (
    <div className="homepage">
      {/*PHẦN TIN NÓNG*/}
      <section className="top-news">
        <div className="top-news__image">
          <img src={hotNewsImage} alt="Hội trường Ban Chấp hành Trung ương Đảng" />
        </div>
        <div className="top-news__overlay">
          <Link to="/news/sua-dieu-le-dang-va-hien-phap" className="top-news__link">
            <h2>
              Sẽ trình Trung ương đề xuất sửa Điều lệ Đảng và Hiến pháp
            </h2>
            <p>
              Chủ tịch Quốc hội Trần Thanh Mẫn giao Thường trực Ủy ban Pháp luật - Tư pháp 
              nghiên cứu sửa một số điều của Hiến pháp về tổ chức bộ máy, để báo cáo cấp có thẩm quyền.
            </p>
          </Link>
        </div>
      </section>
    
      {/* Container cho phần nội dung còn lại */}
      <div className="content-container">

        {/* PHẦN TIN CHÍNH*/}

        {/* PHẦN THỜI SỰ */}
        <section className="main-news">
          <div className="thoi-su-nav">
            <ul>
              <li style={{
                position: 'relative',
                color: '#971616',
                fontSize: 30,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Thời sự</li>
              <li style={{
                position: 'relative',
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Chính trị</li>
              <li style={{
                position: 'relative',
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Đổi mới</li>
              <li style={{
                position: 'relative',
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Đối ngoại</li>
            </ul>
          </div>
          <div className="thoi-su-content">
            <div className="thoi-su-main">
              <Link to="/news/indonesia-ban-21-phat-dai-bac" className="main-news__link">
                <img src={indochaodon} alt="Tổng Bí thư thăm Indonesia" />
                <h3>Indonesia bắn 21 phát đại bác mừng Tổng Bí thư Tô Lâm</h3>
              </Link>
            </div>
            <div className="thoi-su-list">
              <div className="thoi-su-item">
                <img src={asean} alt="Hội nghị ASEAN" />
                <h4>Tổng Bí thư: ASEAN là điểm khởi đầu, tiền đề để Việt Nam hội nhập</h4>
              </div>
              <div className="thoi-su-item">
                <img src={caotoc} alt="Cao tốc" />
                <h4>Thủ tướng: Năm 2025 phải có ít nhất 3.000 km cao tốc</h4>
              </div>
              <div className="thoi-su-item">
                <img src={indo} alt="Cao tốc" />
                <h4>Việt Nam - Indonesia nâng cấp quan hệ lên Đối tác Chiến lược Toàn diện</h4>
              </div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* PHẦN THỂ THAO */}
        <section className="main-news">
        <div className="thoi-su-nav">
            <ul>
              <li style={{
                position: 'relative',
                color: '#971616',
                fontSize: 30,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Thể thao</li>
              <li style={{
                position: 'relative',
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Bóng đá</li>
              <li style={{
                position: 'relative',
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Quần vợt</li>
              <li style={{
                position: 'relative',
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Bóng rổ</li>
            </ul>
          </div>
          <div className="main-news__container">
            <div className="main-news__text">
              <Link to="/sport/antony-mbappe-vinicius" className="main-news__link">
                <h3>"1 MÌNH" ANTONY CÂN CẢ MBAPPE VÀ VINICIUS?</h3>
              </Link>
              <p>
                Antony đang rất ổn, kể từ đội tuyển ngôi sao sáng nhất bên Betis.
                Mbappe tỏa sáng rực rỡ với những cú vô miệng của "Los Blancos".
                Vậy, rút cuộc anh chàng này đã cân cả hai hay không? 
                Hấp dẫn, kịch tính, hay chỉ là một chiêu trò chọc tức Real Madrid?
              </p>
              <p className="main-author">Ảnh Long Rê Real Betis</p>
            </div>
            <div className="main-news__image">
              <img src={anthonyImage} alt="Antony" />
            </div>
          </div>
          <div className="short-news">
            <ul>
              <li>Real Madrid tức giận vì hủy bỏ thẻ đỏ của anh Long</li>
              <li>Messi trở lại Barcelona?</li>
              <li>Đã đến lúc công nhận Pedri là tiền vệ số 1 thế giới</li>
              <li>Di Maria tuyên bố anh 7 sinh ra nhầm thời khi có Messi</li>
            </ul>
          </div>
        </section>

        <hr className="section-divider" />

        {/*PHẦN TIN MỚI*/}
        <section className="other-news">
          
          <div className="other-news__left">
            <div className="left-top">
              <div className="left-text">
                <h3>Chồng đã triệt sản nhưng vợ vẫn mang thai, bác sĩ làm xét nghiệm cho kết quả sốc</h3>
                <p>
                  Trường hợp của ông Nghĩa (tên đã được thay đổi) đã gây chấn động cộng đồng mạng 
                  sau khi ông này phát hiện ra rằng, mặc dù đã trải qua phẫu thuật triệt sản từ ba tháng trước, 
                  vợ ông vẫn bất ngờ mang thai.
                </p>
              </div>
              <img src={husbandImage} alt="Chồng đã triệt sản" />
            </div>
            <div className="left-bottom">
              Ông Nghĩa rất sốc sau vụ việc
            </div>
          </div>

          <div className="other-news__right">
            <div className="other-news__item">
              <h4>Căng: Mỹ nhân showbiz "đăng đàn" tố bạn trai diễn viên "cắm sừng 5678 lần"</h4>
            </div>
            <div className="other-news__item">
              <h4>Trấn Thành nhắc thẳng đàn em: "Em ơi đừng sống keo kiệt"</h4>
            </div>
            <div className="other-news__item">
              <h4>Nam nghệ sĩ bức xúc chỉ tay, nói thẳng mặt những người thiếu tôn trọng</h4>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/*PHẦN 4 Ô TIN TỨC CUỐI */}
        <section className="last-news">
          <div className="thoi-su-nav">
            <ul>
              <li style={{
                position: 'relative',
                color: '#971616',
                fontSize: 30,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Công nghệ</li>
              <li style={{
                position: 'relative',
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>Chuyển đổi số</li>
              <li style={{
                position: 'relative',
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}>AI</li>
              <li style={{
                position: 'relative',
                color: 'black',
                fontSize: 20,
                fontWeight: '700',
                wordWrap: 'break-word'
              }}></li>
            </ul>
          </div>
          <div className="last-news__list">
            <div className="last-news__item">
              <img src={newsImage1} alt="Tin 1" />
              <h3>Binance bị "bảo mật" sao vì chưa niêm yết Pi?</h3>
            </div>
            <div className="last-news__item">
              <img src={newsImage2} alt="Tin 2" />
              <h3>Còn một tuần nhận đề cử Vietnam Game Awards 2025</h3>
            </div>
            <div className="last-news__item">
              <img src={newsImage3} alt="Tin 3" />
              <h3>Trung Quốc vượt Mỹ về số tượng nghiên cứu chip thế hệ mới</h3>
            </div>
            <div className="last-news__item">
              <img src={newsImage4} alt="Tin 4" />
              <h3>Tỉ phú Musk tuyên bố yêu cầu ngăn chặn OpenAI</h3>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MainTitle;

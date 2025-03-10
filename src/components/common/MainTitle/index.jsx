import React from "react";
import { Link } from "react-router-dom";
import "./MainTitle.css"; 
import hotNewsImage from "../../../assets/MainTitle.png";
import anthonyImage from "../../../assets/antony.png";
import husbandImage from "../../../assets/hotnew.png";
import newsImage1 from "../../../assets/image1.png";
import newsImage2 from "../../../assets/image2.png";
import newsImage3 from "../../../assets/image3.png";
import newsImage4 from "../../../assets/image4.png";

const MainTitle = () => {
  return (
    <div className="homepage">
      {/*PHẦN TIN NÓNG*/}
      <section className="top-news">
        <div className="top-news__text">
          <Link to="/news/pham-thoai-sao-ke" className="top-news__link">
            <h2>
              NÓNG: PHẠM THOẠI TUNG 28 TRANG SAO KÊ TÀI KHOẢN MB, ĐỒNG THỜẠI CHẤT VẤN:
              <br />
              "CHO MÌNH HỎI NHỮNG CON SỐ 1.8 TỶ, 2 TỶ, 3.5 TỶ CÁC BẠN LẤY Ở ĐÂU Ạ?"
            </h2>
          </Link>
        </div>
        <div className="top-news__image">
          <img src={hotNewsImage} alt="Phạm ThoẠi Sao Kê" />
        </div>
      </section>

      <hr className="section-divider" />

      {/* PHẦN TIN CHÍNH*/}
      <section className="main-news">
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
        <h2 className="last-news__title">Tin tức mới nhất</h2>
        <div className="last-news__list">
          <div className="last-news__item">
            <img src={newsImage1} alt="Tin 1" />
            <h3>Binance bị "bảo mật" sao vì chưa niêm yết pei?</h3>
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
  );
};

export default MainTitle;

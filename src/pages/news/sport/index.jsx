import React from "react";
import "./sport.css";

// Import hình ảnh từ src/assets
import hlvFonseca from "../../../assets/hlv.png";
import ryanPeake from "../../../assets/ryan.png";
import manUtd from "../../../assets/manutd.png";
import realMadrid from "../../../assets/real.png";
import messi from "../../../assets/messi.png";
import pedri from "../../../assets/pedri.png";
import diMaria from "../../../assets/dimaria.png";
import manUtdMatch from "../../../assets/daumat.png";
import psgLiverpool from "../../../assets/psgliver.png";
import arsenal from "../../../assets/arneta.png";
import realBetis from "../../../assets/betis.png";
import neymarMbappe from "../../../assets/m3p.png";
import amorim from "../../../assets/amorim.png";
import alisson from "../../../assets/alison.png";
import vnFootball from "../../../assets/hoatinh.png";
import arteta from "../../../assets/arneta.png";
import billiard from "../../../assets/bida.png";

// Component hiển thị ảnh hoặc khung trống nếu không có ảnh
const ImageWithFallback = ({ src, alt, className = "" }) => {
  const [imgError, setImgError] = React.useState(false);
  
  const handleError = () => {
    setImgError(true);
  };
  
  if (imgError) {
    return <div className={`image-placeholder ${className}`}>{alt}</div>;
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={handleError}
    />
  );
};

const SportPage = () => {
  return (
    <div className="sport-container">
      <h1 className="sport-title">Thể Thao</h1>
      
      <div className="sport-news-grid">
        <div className="main-news">
          <div className="news-item main-news-item">
            <ImageWithFallback src={hlvFonseca} alt="HLV Paulo Fonseca" />
            <h2>HLV bật khóc khi được các cầu thủ ôm động viên ở Europa League</h2>
            <p>Sau khi mở tỷ số vào lưới FCSB tại lượt đi vòng 1/8 Europa League, các cầu thủ Lyon chạy đến ôm HLV Paulo Fonseca, khiến ông bật khóc.</p>
          </div>
        </div>

        <div className="side-news">
          <div className="news-item">
            <ImageWithFallback src={ryanPeake} alt="Ryan Peake" />
            <h3>Ryan Peake - từ tù nhân tới nhà vô địch golf</h3>
          </div>
          
          <div className="news-item">
            <ImageWithFallback src={manUtd} alt="Man Utd" />
            <h3>Trận Man Utd được tạm dừng để cầu thủ ăn</h3>
          </div>
        </div>
      </div>

      <div className="divider"></div>

      <div className="small-news-grid">
        <div className="news-item small-news-item">
          <ImageWithFallback src={realMadrid} alt="Real Madrid" />
          <h3>Real Madrid từ giận vì hủy bỏ thẻ đỏ của anh Long</h3>
        </div>
        
        <div className="news-item small-news-item">
          <ImageWithFallback src={messi} alt="Messi" />
          <h3>Messi trở lại Barcelona?</h3>
        </div>
        
        <div className="news-item small-news-item">
          <ImageWithFallback src={pedri} alt="Pedri" />
          <h3>Đã đến lúc công nhận Pedri là tiền vệ số 1 thế giới</h3>
        </div>
        
        <div className="news-item small-news-item">
          <ImageWithFallback src={diMaria} alt="Di Maria" />
          <h3>Di Maria tuyên bố anh 7 sinh ra nhầm thời khi có Messi</h3>
        </div>
      </div>

      <div className="match-highlights">
        <div className="news-item match-item">
          <ImageWithFallback src={manUtdMatch} alt="Man Utd match" />
          <h3>HÃY XEM MAN UTD ĐÁ BÓNG NẾU BẠN MUỐN ĐAU MẮT</h3>
          <p>CÓ ALISSON BECKER Ở ĐÓ</p>
        </div>
        
        <div className="news-item match-item">
          <ImageWithFallback src={psgLiverpool} alt="PSG vs Liverpool" />
          <h3>PSG VS LIVERPOOL: SÚT NỬA DI, SÚT 27 QUẢ RỒI THUA DI VÌ CÓ ALISSON BECKER Ở ĐÓ</h3>
        </div>
        
        <div className="news-item match-item">
          <ImageWithFallback src={arsenal} alt="Arsenal" />
          <h3>ARSENAL ĐÃ TẠO NÊN LỊCH SỬ Ở CHAMPIONS LEAGUE NHƯ THẾ NÀO?</h3>
        </div>
        
        <div className="news-item match-item">
          <ImageWithFallback src={realBetis} alt="Real Madrid vs Betis" />
          <h3>THUA NGƯỢC BETIS, REAL MADRID LỠ CƠ HỘI VƯƠN LÊN DẪN ĐẦU LA LIGA</h3>
        </div>
      </div>

      <div className="divider"></div>

      <div className="featured-news">
        <div className="news-item featured-news-item">
          <ImageWithFallback src={neymarMbappe} alt="Neymar và Mbappe" />
          <h2>Neymar từng chơi khảm Mbappe khi còn khoác áo PSG</h2>
          <p>Neymar lên vè trước khiến Kylian Mbappe phải ở lại thanh toán hóa đơn trong một lần đi chơi lúc còn là đồng đội ở PSG.</p>
        </div>
      </div>

      <div className="side-articles">
        <div className="news-item side-article">
          <ImageWithFallback src={amorim} alt="Amorim" />
          <h4>Amorim: 'Tôi sẽ không được trao nhiều thời gian như Arteta'</h4>
        </div>
        
        <div className="news-item side-article">
          <ImageWithFallback src={alisson} alt="Alisson" />
          <h4>Vì sao Alisson không phải là thủ môn hay nhất Ngoại hạng Anh mùa này?</h4>
        </div>
        
        <div className="news-item side-article">
          <ImageWithFallback src={vnFootball} alt="Vietnam football" />
          <h4>HLV Kim Tinh buộc bỏ lứa đội nhỉ gọi là 'Hòa Tĩnh'</h4>
        </div>
        
        <div className="news-item side-article">
          <ImageWithFallback src={arteta} alt="Arteta" />
          <h4>Arteta: 'Gặp Man Utd phải đá như khi thắng PSV'</h4>
        </div>
        
        <div className="news-item side-article">
          <ImageWithFallback src={billiard} alt="Billiards" />
          <h4>Việt Nam chuẩn bị bảo vệ danh hiệu billiard đồng đội thế giới</h4>
        </div>
      </div>
    </div>
  );
};

export default SportPage;

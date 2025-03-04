import React from "react";
import "./MainTitle.css";
import hotNewsImage from "../../../assets/MainTitle.png";

const MainTitle = () => {
    return (
      <div className="main-title">
        <div className="main-title-left">
          <h2>
            NÓNG: PHẠM THOẠI TUNG 28 TRANG SAO KÊ TÀI KHOẢN MB, ĐỒNG THỜI CHẤT VẤN: <br />
            “CHO MÌNH HỎI NHỮNG CON SỐ 1.8 TỶ, 2 TỶ, 3.5 TỶ CÁC BẠN LẤY Ở ĐÂU Ạ?”
          </h2>
        </div>
        <div className="main-title-right">
          <img src={hotNewsImage} alt="Phạm Thoại Sao Kê" />
        </div>
  
      </div>
    );
  };
  
  export default MainTitle;

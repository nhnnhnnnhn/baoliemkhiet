import React from "react";
import {
  Container,
  Typography,
  Divider,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent
} from "@mui/material";

import id1 from "../../../assets/id1.png";
import id2 from "../../../assets/id2.png";
import id3 from "../../../assets/id3.png";
import id4 from "../../../assets/id4.png";
import id5 from "../../../assets/id5.png";
import id6 from "../../../assets/id6.png";
import id7 from "../../../assets/id7.png";
import id8 from "../../../assets/id8.png";
import id9 from "../../../assets/id9.png";
import id10 from "../../../assets/id10.png";
import id11 from "../../../assets/id11.png";

// Mảng dữ liệu
const articles = [
  // 2 bài đầu (overlay)
  {
    id: 1,
    title: "Nhu cầu tuyển dụng lập trình viên lao dốc",
    description:
      "Nhiều công ty chuyển sang sử dụng AI, khiến thị trường việc làm cho lập trình viên biến động...",
    image: id1
  },
  {
    id: 2,
    title: "Thiết bị 5G Việt Nam sẵn sàng cho mạng nước ngoài",
    description:
      "Các nhà sản xuất Việt Nam đã thành công trong việc tích hợp 5G cho thị trường quốc tế...",
    image: id2
  },
  // 4 bài tiếp theo (hàng 2)
  {
    id: 3,
    title: "Các mô hình AI nổi bật hiện nay",
    description:
      "Trí tuệ nhân tạo ngày càng phát triển, dẫn đến nhiều mô hình AI mới ra đời, ứng dụng rộng rãi...",
    image: id3
  },
  {
    id: 4,
    title: "iPhone 16e - giá thấp nhưng không đáng để nâng cấp?",
    description:
      "Mẫu iPhone mới gây tranh cãi khi so sánh hiệu năng và thời lượng pin với các thế hệ trước...",
    image: id4
  },
  {
    id: 5,
    title: "Apple ra Mac Studio giá cao nhất 368,5 triệu đồng",
    description:
      "Sản phẩm hướng tới người dùng chuyên nghiệp, đòi hỏi sức mạnh xử lý đồ hoạ cao...",
    image: id5
  },
  {
    id: 6,
    title: "Ông Trump: TSMC sẽ đầu tư 100 tỷ USD xây 5 nhà máy tại Mỹ",
    description:
      "Hãng chip lớn nhất thế giới có kế hoạch mở rộng quy mô sản xuất tại Arizona...",
    image: id6
  },
  // 5 bài cuối (danh sách dọc)
  {
    id: 7,
    title: "Ứng dụng DeepSeek bị 'hạ bệ' trên App Store Trung Quốc",
    description:
      "DeepSeek, công cụ tìm kiếm AI, vừa bị gỡ bỏ vì lý do bảo mật dữ liệu người dùng...",
    image: id7
  },
  {
    id: 8,
    title: "Loạt sản phẩm 'trưng bày' tại triển lãm di động lớn nhất năm",
    description:
      "MWC năm nay chứng kiến sự đổ bộ của loạt smartphone màn hình gập, laptop AI...",
    image: id8
  },
  {
    id: 9,
    title: "Tổng Bí thư: 'Khẩn trương ban hành danh mục công nghệ chiến lược'",
    description:
      "Tại Hội thảo, nhiều ý kiến cho rằng cần quy hoạch danh mục công nghệ chiến lược...",
    image: id9
  },
  {
    id: 10,
    title: "Xây dựng bản đồ doanh nghiệp công nghệ số Việt Nam",
    description:
      "Bản đồ doanh nghiệp số nhằm xác định các 'hạt nhân' thúc đẩy chuyển đổi số quốc gia...",
    image: id10
  },
  {
    id: 11,
    title: "Internet di động Việt Nam tăng 15 bậc trên bảng xếp hạng thế giới",
    description:
      "Tốc độ di động trung bình đạt 134 Mbps, tăng 15 bậc so với 2022 và lọt vào top 22 thế giới...",
    image: id11
  }
];

export default function TechnologyPage() {
  // Tách dữ liệu:
  const firstTwo = articles.slice(0, 2);   // 2 bài lớn 
  const nextFour = articles.slice(2, 6);  // 4 bài trung bình
  const lastFive = articles.slice(6);     // 5 bài dọc

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* Tiêu đề + đường kẻ ngang */}
      <Box sx={{ mb: 2 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: "600",
          fontFamily: "Gloria Hallelujah",
          color: "#971616", 
          fontsize: "48px"
        }}
      >
        Công nghệ
      </Typography>
      <Divider sx={{ mt: 2, borderBottomWidth: 2 }} />
    </Box>

      {/* HÀNG 1: 2 bài lớn */}
      <Grid container spacing={0} sx={{ mb: 0 }}>
        {firstTwo.map((item) => (
          <Grid item xs={12} md={6} key={item.id}>
            <Card sx={{ height: "100%", position: "relative", borderRadius: 0  }}>
              <CardActionArea sx={{ height: "100%", position: "relative"}}>
                {/* Ảnh */}
                <CardMedia
                  component="img"
                  height="350"
                  image={item.image}
                  alt={item.title}
                  sx={{ objectFit: "cover" }}
                />
                {/* Overlay chữ màu trắng ở dưới */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "#fff",
                    p: 2
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2">
                    {item.description}
                  </Typography>
                </Box>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        
      </Grid>
      

      {/* HÀNG 2: 4 bài trung bình */}
      <Grid container spacing={0} sx={{ mb: 2 }}>
        {nextFour.map((item) => (
          <Grid item xs={12} sm={6} md={3} key={item.id}  >
            <Card sx={{ height: "100%", borderRadius: 0, boxShadow: 0,  }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image}
                  alt={item.title}
                />
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Divider sx={{ mb: 5, mt: 5, borderColor: "black" }} />

      {/* DANH SÁCH DỌC: 5 bài cuối */}
      <Grid container spacing={2}>
        {lastFive.map((item) => (
          <Grid item xs={12} key={item.id}>
            <Card sx={{ display: "flex" ,height: "100%", borderRadius: 0, boxShadow: 0 }}>
              {/* Ảnh bên trái, cố định width */}
              <CardMedia
                component="img"
                sx={{ width: 180 }}
                image={item.image}
                alt={item.title}
              />
              {/* Nội dung bên phải */}
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

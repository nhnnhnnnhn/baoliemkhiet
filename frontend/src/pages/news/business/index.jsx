import React from "react";
import { Box, Typography, Grid, Card, CardMedia, CardContent, Divider } from "@mui/material";

const news = [
  {
    title: "VinFast vào top 500 doanh nghiệp tốt nhất 2025",
    img: "https://via.placeholder.com/600x400",
  },
  {
    title: "Không nên đánh thuế tiêu thụ đặc biệt với xăng, dầu hoả",
    img: "https://via.placeholder.com/600x400",
  },
  {
    title: "London thoát ế nhờ khách ngoại khi nhu cầu kiến Vùng phát triển thấp",
    img: "https://via.placeholder.com/600x400",
  },
  {
    title: "Trung Quốc áp thuế trả đũa Canada",
    img: "https://via.placeholder.com/600x400",
  },
  {
    title: "Thủ tướng yêu cầu cân bằng thương mại với các đối tác lớn",
    img: "https://via.placeholder.com/600x400",
  },
];

const detailedNews = [
  {
    title: "Tổng Bí thư: Tạo thuận lợi cho doanh nghiệp Indonesia đầu tư tại Việt Nam",
    description:
      "Tiếp lãnh đạo các tập đoàn, doanh nghiệp lớn của Indonesia, Tổng Bí thư khẳng định Việt Nam sẽ tiếp tục cải cách thể chế, tạo thuận lợi cho doanh nghiệp đầu tư, hợp tác.",
    img: "https://via.placeholder.com/600x400",
  },
  {
    title: "Quỹ ngoại lớn nhất cam kết hoàn tiền nếu không sinh lời bằng VN-Index",
    description:
      "VEIL, quỹ đầu tư có tổng tài sản 1,8 tỷ USD, lớn nhất ở Việt Nam, sẽ kích hoạt điều khoản hoàn trả tối đa 100% vốn nếu hiệu suất sinh lời 5 năm tới không tốt hơn VN-Index.",
    img: "https://via.placeholder.com/600x400",
  },
  // thêm các bài viết tương tự khác
];

const BusinessPage = () => {
  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", color: "#971616", fontFamily: "'Gloria Hallelujah', cursive" }}>
        Kinh doanh
      </Typography>
      <Divider sx={{ my: 2, borderColor: "black" }} />

      <Grid container spacing={2}>
        {news.map((item, index) => (
          <Grid item xs={12} sm={index < 2 ? 6 : 4} key={index}>
            <Card>
              <CardMedia component="img" image={item.img} alt={item.title} height="180" />
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  {item.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 4 }}>
        {detailedNews.map((item, index) => (
          <Card key={index} sx={{ display: "flex", mb: 2 }}>
            <CardMedia component="img" image={item.img} alt={item.title} sx={{ width: 200 }} />
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default BusinessPage;

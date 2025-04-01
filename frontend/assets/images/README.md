# Hướng dẫn quản lý hình ảnh

Thư mục này chứa tất cả các hình ảnh được sử dụng trong ứng dụng Báo Liêm Khiết. Để duy trì tính nhất quán, vui lòng tuân thủ cấu trúc và quy tắc đặt tên sau đây.

## Cấu trúc thư mục

- `/news/` - Hình ảnh cho các bài báo tin tức chung
- `/sport/` - Hình ảnh liên quan đến thể thao
- `/politics/` - Hình ảnh liên quan đến chính trị
- `/technology/` - Hình ảnh liên quan đến công nghệ
- `/economy/` - Hình ảnh liên quan đến kinh tế
- `/banners/` - Hình ảnh banner cho trang chủ và các trang phụ
- `/ui/` - Biểu tượng, logo và các phần tử giao diện người dùng
- `/avatars/` - Hình đại diện người dùng

## Quy tắc đặt tên

1. Sử dụng chữ thường và dấu gạch ngang để ngăn cách các từ (ví dụ: `the-thao-seagame-2023.jpg`)
2. Bắt đầu tên file với chủ đề hoặc mục đích (ví dụ: `sport-world-cup-2022.jpg`)
3. Thêm ngày tháng vào cuối tên nếu nội dung liên quan đến thời gian cụ thể (ví dụ: `news-hoi-nghi-trung-uong-2023-05-20.jpg`)

## Yêu cầu về định dạng và kích thước

### Định dạng
- **JPG**: Cho hình ảnh có nhiều chi tiết và màu sắc
- **PNG**: Cho hình ảnh có nền trong suốt hoặc cần độ sắc nét cao
- **SVG**: Cho logo, biểu tượng và đồ họa vector

### Kích thước
- **Hình ảnh bài viết**: 800x450 pixel
- **Thumbnail**: 300x200 pixel
- **Banner**: 1200x400 pixel
- **Avatar**: 200x200 pixel

### Yêu cầu về dung lượng
- Dung lượng tối đa cho mỗi hình ảnh: 300KB
- Tối ưu hóa hình ảnh trước khi thêm vào dự án

## Hướng dẫn import

Khi import hình ảnh vào mã nguồn, sử dụng đường dẫn tương đối từ thư mục `src`:

```jsx
// Đối với hình ảnh UI/Logo
import logo from "../../assets/images/ui/logo.svg";

// Đối với hình ảnh bài viết
import newsImage from "../../assets/images/news/tin-tuc-moi-nhat.jpg";

// Đối với hình ảnh thể thao
import sportImage from "../../assets/images/sport/world-cup-2022.jpg";
```

## Công cụ tối ưu hóa

Một số công cụ được khuyến nghị để tối ưu hóa hình ảnh:
- [TinyPNG](https://tinypng.com/) - Nén hình ảnh PNG và JPG
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - Tối ưu hóa file SVG
- [ImageOptim](https://imageoptim.com/) - Ứng dụng desktop để tối ưu hóa hình ảnh

## Quy trình thêm hình ảnh mới

1. Tối ưu hóa hình ảnh bằng công cụ phù hợp
2. Đặt tên theo quy tắc đã định
3. Thêm vào thư mục thích hợp dựa trên nội dung
4. Import vào mã nguồn với đường dẫn tương đối 
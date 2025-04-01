# Thư mục tài nguyên đa phương tiện

Thư mục này chứa tất cả các tài nguyên đa phương tiện (hình ảnh, video, âm thanh) được sử dụng trong ứng dụng Báo Liêm Khiết.

## Cấu trúc thư mục

- `/images/` - Tất cả các hình ảnh
  - `/images/news/` - Hình ảnh cho các bài báo tin tức
  - `/images/sport/` - Hình ảnh liên quan đến thể thao
  - `/images/politics/` - Hình ảnh liên quan đến chính trị
  - `/images/technology/` - Hình ảnh liên quan đến công nghệ
  - `/images/economy/` - Hình ảnh liên quan đến kinh tế
  - `/images/banners/` - Hình ảnh banner cho trang chủ và các trang phụ
  - `/images/ui/` - Biểu tượng, logo và các phần tử giao diện người dùng
  - `/images/avatars/` - Hình đại diện người dùng
- `/videos/` - Tất cả các video
  - `/videos/news/` - Video cho các bài báo tin tức
  - `/videos/sport/` - Video liên quan đến thể thao
  - `/videos/interviews/` - Video phỏng vấn
- `/audio/` - Tất cả các file âm thanh (podcast, phỏng vấn)

## Các quy tắc chung

Khi thêm mới tài nguyên, vui lòng xem hướng dẫn chi tiết trong từng thư mục con:

- Xem `images/README.md` để biết quy tắc sử dụng hình ảnh
- Xem `videos/README.md` để biết quy tắc sử dụng video
- Xem `audio/README.md` để biết quy tắc sử dụng âm thanh

## Quy tắc chung về đặt tên

1. Sử dụng chữ thường và dấu gạch ngang để ngăn cách các từ (kebab-case).
2. Đặt tên có ý nghĩa, mô tả nội dung của tài nguyên.
3. Bắt đầu tên file với loại nội dung: `sport-`, `news-`, `ui-`, `avatar-`, v.v.
4. Thêm ngày tháng vào tên nếu cần: `news-hoi-nghi-trung-uong-2023-05-20.jpg`

## Hướng dẫn tối ưu hóa

- Tối ưu hóa tất cả tài nguyên trước khi thêm vào dự án
- Sử dụng đúng định dạng file cho từng loại tài nguyên
- Tuân thủ giới hạn kích thước được đề xuất trong mỗi hướng dẫn

## Hướng dẫn truy cập tài nguyên

Trong mã nguồn React, sử dụng đường dẫn tương đối để truy cập tài nguyên:

```jsx
// Đối với component trong src/components
import logo from "../../assets/images/ui/logo.svg";
import newsImage from "../../assets/images/news/thoi-su-moi.jpg";
import videoThumb from "../../assets/images/sport/world-cup-2022.jpg";
```

## Lưu ý

- Không lưu trữ tệp tin lớn (>5MB) trong repository - sử dụng CDN hoặc dịch vụ lưu trữ bên ngoài thay thế
- Backup tài nguyên gốc riêng biệt với dự án
- Tuân thủ bản quyền và giấy phép sử dụng cho tất cả tài nguyên 
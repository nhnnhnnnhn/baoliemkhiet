# Ứng Dụng Tin Tức

Đây là ứng dụng tin tức được xây dựng bằng React, cho phép người dùng đọc tin tức từ nhiều danh mục khác nhau như thể thao và các chủ đề khác.

## Tính Năng

- Giao diện người dùng thân thiện với Material UI
- Hệ thống định tuyến (routing) để dễ dàng điều hướng giữa các trang
- Các trang tin tức theo chủ đề (thể thao, v.v.)
- Chức năng tìm kiếm tin tức
- Hệ thống đăng nhập tài khoản
- Khu vực quản trị dành cho admin

## Công Nghệ Sử Dụng

- React 18
- React Router v7
- Material UI
- Context API cho quản lý trạng thái
- Custom hooks

## Cấu Trúc Dự Án

```
src/
|-- apis/            # Các API calls và xử lý dữ liệu
|-- assets/          # Tài nguyên (hình ảnh, fonts, v.v.)
|-- components/      # Các component tái sử dụng
|   |-- common/      # Components dùng chung (header, footer)
|   |-- news/        # Components liên quan đến tin tức
|   |-- admin/       # Components dành cho quản trị viên
|-- context/         # Context providers
|-- hooks/           # Custom hooks
|-- layouts/         # Bố cục trang
|-- module/          # Các module chức năng
|-- pages/           # Các trang trong ứng dụng
|   |-- news/        # Trang tin tức
|   |-- home/        # Trang chủ
|   |-- search/      # Trang tìm kiếm
|   |-- login/       # Trang đăng nhập
|   |-- account/     # Trang tài khoản người dùng
|   |-- admin/       # Trang quản trị
|-- router/          # Cấu hình định tuyến
```

## Bắt Đầu

### Cài Đặt

1. Clone dự án về máy:
```bash
git clone https://github.com/nhnnhnnnhn/baoliemkhiet
cd baoliemkhiet
```

2. Cài đặt các phụ thuộc:
```bash
npm install
```

### Các Lệnh Có Sẵn

#### `npm start`

Chạy ứng dụng ở chế độ phát triển.\
Mở [http://localhost:3000](http://localhost:3000) để xem trong trình duyệt.

Trang sẽ tự động tải lại khi bạn thay đổi mã nguồn.\
Bạn cũng có thể xem lỗi lint trong console.

#### `npm test`

Chạy trình kiểm thử ở chế độ tương tác.

#### `npm run build`

Biên dịch ứng dụng cho môi trường sản xuất vào thư mục `build`.\
Đóng gói React ở chế độ sản xuất và tối ưu hóa build để hiệu suất tốt nhất.

Build được tối thiểu hóa và tên tệp bao gồm hàm băm.\
Ứng dụng của bạn đã sẵn sàng để triển khai!

## Triển Khai

Ứng dụng này được triển khai trên nền tảng Vercel


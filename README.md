# Báo Liêm Khiết - Dự án Báo Điện Tử

Trang báo điện tử sử dụng React và Vite, với giao diện hiện đại và đầy đủ chức năng.

## Công nghệ sử dụng

- React 18
- Vite
- Material-UI 
- React Router
- Context API cho quản lý state

## Cấu trúc thư mục

```
baoliemkhiet/
│
├── public/                  # Static files
│   ├── favicons/            # Các biểu tượng cho trình duyệt
│   ├── site.webmanifest     # Web App Manifest
│   └── browserconfig.xml    # Config cho Microsoft Edge
│
├── src/                     # Source code
│   ├── assets/              # Hình ảnh, font chữ, etc.
│   ├── components/          # React components
│   │   ├── common/          # Shared components (Header, Footer, etc.)
│   │   ├── layout/          # Layout components
│   │   └── pages/           # Page components
│   │
│   ├── context/             # React Context API
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── App.jsx              # Main App component
│   └── main.jsx             # Application entry point
│
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md                # Project documentation
```

## Cài đặt và Chạy

### Yêu cầu

- Node.js 16.x trở lên
- npm hoặc pnpm

### Cài đặt

```bash
# Sử dụng npm
npm install

# Hoặc sử dụng pnpm
pnpm install
```

### Chạy môi trường phát triển

```bash
# Sử dụng npm
npm run dev

# Hoặc sử dụng pnpm
pnpm dev
```

Ứng dụng sẽ chạy tại địa chỉ [http://localhost:3000](http://localhost:3000)

### Build cho production

```bash
# Sử dụng npm
npm run build

# Hoặc sử dụng pnpm
pnpm build
```

## Tính năng

- Trang chủ hiển thị các bài viết mới nhất
- Phân loại bài viết theo chuyên mục
- Tìm kiếm bài viết
- Đăng nhập/Đăng ký tài khoản
- Bình luận trên bài viết
- Chế độ xem tối/sáng (Dark/Light mode)
- Responsive design cho tất cả các thiết bị

## Lưu ý về migration từ CRA sang Vite

Dự án này đã được chuyển đổi từ Create React App (CRA) sang Vite. Để biết thêm chi tiết về quá trình này, vui lòng xem file `MIGRATION_CRA_TO_VITE.md`.


/**
 * Các hằng số sử dụng trong ứng dụng
 */

// API URL
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Phân trang
export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_PAGE = 1;

// Trạng thái bài viết
export const ARTICLE_STATUS = {
  DRAFT: 'DRAFT',
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// Map trạng thái hiển thị
export const ARTICLE_STATUS_DISPLAY = {
  [ARTICLE_STATUS.DRAFT]: 'Bản nháp',
  [ARTICLE_STATUS.PENDING]: 'Chờ duyệt',
  [ARTICLE_STATUS.APPROVED]: 'Đã xuất bản',
  [ARTICLE_STATUS.REJECTED]: 'Bị từ chối',
};

// Loại người dùng
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  AUTHOR: 'AUTHOR',
  USER: 'USER',
};

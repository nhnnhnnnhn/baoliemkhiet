/**
 * Types dành cho bài viết
 */

export interface Author {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
}

export type ArticleStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';

export interface Article {
  id: number;
  title: string;
  slug?: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  author?: Author;
  category?: Category;
  tags?: Tag[];
  status: ArticleStatus;
  published_at?: string;
  updated_at?: string;
  created_at: string;
  view?: number;
}

export interface ArticleListItem extends Omit<Article, 'content'> {
  content?: string; // Làm content trở thành optional trong danh sách
}

/**
 * Giao diện cho form tạo/chỉnh sửa bài viết
 */
export interface ArticleFormValues {
  title: string;
  content: string;
  excerpt?: string;
  thumbnail?: string;
  authorId?: number;
  categoryId?: number;
  tagIds?: number[];
  status: ArticleStatus;
  published_at?: string;
}

/**
 * Giao diện cho response từ API
 */
export interface ArticleResponse {
  success: boolean;
  data: Article;
  message?: string;
}

export interface ArticleListResponse {
  success: boolean;
  data: {
    articles: ArticleListItem[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  };
  message?: string;
}

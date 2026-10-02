export interface BlogComment {
  id: string;
  userName: string;
  commentText: string;
  createdAt?: string;
}

export interface BlogPost {
  id: string;
  _id?: string;
  title: string;
  metaDescription?: string;
  content: string;
  category: string;
  author: string;
  authorRole?: string;
  date: string;
  readTime: string;
  image?: string;
  tags: string[];
  status?: 'published' | 'draft' | 'archived';
  likes?: number;
  comments?: BlogComment[];
  commentsCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateBlogPostInput = {
  title: string;
  metaDescription?: string;
  content: string;
  category: string;
  author: string;
  authorRole?: string;
  date: string;
  readTime: string;
  image?: string;
  tags: string[];
  status?: 'published' | 'draft' | 'archived';
};

export type UpdateBlogPostInput = Partial<CreateBlogPostInput>;

export type CreateBlogCommentInput = {
  userName: string;
  commentText: string;
};

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
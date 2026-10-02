/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  fetchBlogsApi,
  fetchBlogByIdApi,
  createBlogApi,
  updateBlogApi,
  deleteBlogApi,
  addCommentApi,
  deleteCommentApi,
  likeBlogApi,
} from './blogApi';
import type { BlogPost, CreateBlogCommentInput } from './blogTypes';

interface BlogState {
  blogs: BlogPost[];
  singleBlog: BlogPost | null;
  selectedBlogId: string | null;
  isCommentModalOpen: boolean;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
}

const initialState: BlogState = {
  blogs: [],
  singleBlog: null,
  selectedBlogId: null,
  isCommentModalOpen: false,
  isLoading: false,
  isError: false,
  errorMessage: null,
};

// Helper: ব্যাকএন্ড থেকে এরর বা ভ্যালিডেশন মেসেজ বের করার ফাংশন
const getErrorMessage = (error: any, defaultMsg: string): string => {
  const data = error.response?.data;

  if (data) {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors
        .map((err: any) => {
          if (typeof err === 'string') return err;
          return err.message || err.msg || JSON.stringify(err);
        })
        .join(', ');
    }

    if (data.message && data.message !== 'Validation failed') {
      return data.message;
    }

    if (data.error) {
      return typeof data.error === 'string'
        ? data.error
        : JSON.stringify(data.error);
    }
  }

  return error.message || defaultMsg;
};

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchBlogsApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'ব্লগ লোড করতে সমস্যা হয়েছে'));
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blog/fetchBlogById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetchBlogByIdApi(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'ব্লগ ডিটেইলস পাওয়া যায়নি'));
    }
  }
);

export const createBlog = createAsyncThunk(
  'blog/createBlog',
  async (blogData: FormData | Record<string, any>, { rejectWithValue }) => {
    try {
      const response = await createBlogApi(blogData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'ব্লগ তৈরি করতে ব্যর্থ হয়েছে'));
    }
  }
);

export const updateBlog = createAsyncThunk(
  'blog/updateBlog',
  async (
    { id, blogData }: { id: string; blogData: FormData | Record<string, any> },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateBlogApi(id, blogData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'ব্লগ আপডেট করতে ব্যর্থ হয়েছে'));
    }
  }
);

export const deleteBlog = createAsyncThunk(
  'blog/deleteBlog',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteBlogApi(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'ব্লগ মুছে ফেলা সম্ভব হয়নি'));
    }
  }
);

export const addComment = createAsyncThunk(
  'blog/addComment',
  async (
    { blogId, commentData }: { blogId: string; commentData: CreateBlogCommentInput },
    { rejectWithValue }
  ) => {
    try {
      const response = await addCommentApi(blogId, commentData);
      
      // Axios response, Interceptor response অথবা Direct JSON—যেকোনো স্ট্রাকচার সেফলি বের করে আনা
      const responseData = response?.data || response;
      const comment = responseData?.data || responseData?.comment || responseData;
      const message = responseData?.message || 'আপনার মন্তব্য সফলভাবে যোগ করা হয়েছে';

      return {
        blogId,
        comment,
        message,
      };
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'কমেন্ট যোগ করা যায়নি'));
    }
  }
);

export const deleteComment = createAsyncThunk(
  'blog/deleteComment',
  async (commentId: string, { rejectWithValue }) => {
    try {
      await deleteCommentApi(commentId);
      return commentId;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error, 'কমেন্ট মুছে ফেলা সম্ভব হয়নি'));
    }
  }
);

export const likeBlog = createAsyncThunk(
  'blog/likeBlog',
  async (
    { id, action }: { id: string; action?: 'like' | 'unlike' },
    { rejectWithValue }
  ) => {
    try {
      const response = await likeBlogApi(id, action);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        getErrorMessage(
          error,
          action === 'unlike'
            ? 'লাইক তুলে নেওয়া সম্ভব হয়নি'
            : 'লাইক দেওয়া সম্ভব হয়নি'
        )
      );
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    setSelectedBlogId: (state, action: PayloadAction<string | null>) => {
      state.selectedBlogId = action.payload;
    },
    toggleCommentModal: (state) => {
      state.isCommentModalOpen = !state.isCommentModalOpen;
    },
    setCommentModalState: (state, action: PayloadAction<boolean>) => {
      state.isCommentModalOpen = action.payload;
    },
    clearBlogError: (state) => {
      state.isError = false;
      state.errorMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action: PayloadAction<BlogPost[]>) => {
        state.isLoading = false;
        state.blogs = action.payload;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Fetch Blog By ID
      .addCase(fetchBlogById.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action: PayloadAction<BlogPost>) => {
        state.isLoading = false;
        state.singleBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Create Blog
      .addCase(createBlog.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(createBlog.fulfilled, (state, action: PayloadAction<BlogPost>) => {
        state.isLoading = false;
        state.blogs.unshift(action.payload);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Update Blog
      .addCase(updateBlog.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.errorMessage = null;
      })
      .addCase(updateBlog.fulfilled, (state, action: PayloadAction<BlogPost>) => {
        state.isLoading = false;
        const idToFind = action.payload.id || action.payload._id;
        const index = state.blogs.findIndex(
          (b) => (b.id || b._id) === idToFind
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        if ((state.singleBlog?.id || state.singleBlog?._id) === idToFind) {
          state.singleBlog = action.payload;
        }
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.errorMessage = action.payload as string;
      })

      // Delete Blog
      .addCase(deleteBlog.fulfilled, (state, action: PayloadAction<string>) => {
        state.blogs = state.blogs.filter(
          (blog) => (blog.id || blog._id) !== action.payload
        );
      })

      // Add Comment (Real-time Update)
      .addCase(
        addComment.fulfilled,
        (
          state,
          action: PayloadAction<{ blogId: string; comment: any; message: string }>
        ) => {
          const { blogId, comment } = action.payload;

          // Single Blog আপডেট
          if (
            state.singleBlog &&
            (state.singleBlog.id === blogId || state.singleBlog._id === blogId)
          ) {
            if (!state.singleBlog.comments) {
              state.singleBlog.comments = [];
            }
            state.singleBlog.comments.unshift(comment);
          }

          // Main Blogs array আপডেট
          const blogIndex = state.blogs.findIndex(
            (b) => (b.id || b._id) === blogId
          );
          if (blogIndex !== -1) {
            if (!state.blogs[blogIndex].comments) {
              state.blogs[blogIndex].comments = [];
            }
            state.blogs[blogIndex].comments!.unshift(comment);
          }
        }
      )

      // Delete Comment (Real-time Delete)
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<string>) => {
        const deletedCommentId = action.payload;
        if (state.singleBlog && state.singleBlog.comments) {
          state.singleBlog.comments = state.singleBlog.comments.filter(
            (comment: any) => (comment.id || comment._id) !== deletedCommentId
          );
        }
      })

      // Like / Unlike Blog (Real-time Update)
      .addCase(likeBlog.fulfilled, (state, action: PayloadAction<BlogPost>) => {
        const idToFind = action.payload.id || action.payload._id;
        const index = state.blogs.findIndex(
          (b) => (b.id || b._id) === idToFind
        );
        if (index !== -1) {
          state.blogs[index] = action.payload;
        }
        if ((state.singleBlog?.id || state.singleBlog?._id) === idToFind) {
          state.singleBlog = action.payload;
        }
      });
  },
});

export const {
  setSelectedBlogId,
  toggleCommentModal,
  setCommentModalState,
  clearBlogError,
} = blogSlice.actions;

export default blogSlice.reducer;

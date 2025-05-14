import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './thunks/auth/authSlice';
import userReducer from './thunks/user/userSlice';
import tagReducer from './thunks/tag/tagSlice';
import categoryReducer from './thunks/category/categorySlice';
import articleReducer from './thunks/article/articleSlice';
import commentReducer from './thunks/comment/commentSlice';
import notificationReducer from './thunks/notification/notificationSlice';
import reportReducer from './thunks/report/reportSlice';
import followReducer from './thunks/follow/followSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    tag: tagReducer,
    category: categoryReducer,
    article: articleReducer,
    comment: commentReducer,
    notification: notificationReducer,
    report: reportReducer,
    follow: followReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store };
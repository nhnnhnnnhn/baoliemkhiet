import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import authReducer from './thunks/auth/authSlice';
import userReducer from './thunks/user/userSlice';
import tagReducer from './thunks/tag/tagSlice';
import categoryReducer from './thunks/category/categorySlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    tag: tagReducer,
    category: categoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { store };
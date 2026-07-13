import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "../features/theme/themeSlice";
import authReducer from "../features/auth/authSlice";
import cartReducer from "../features/cart/cartSlice";

// Configure the Redux store
export const store = configureStore({
  reducer: {
    theme: themeReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});

// Define TypeScript types for the Redux store's state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
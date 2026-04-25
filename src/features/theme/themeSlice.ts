import { createSlice } from "@reduxjs/toolkit";

// Define the shape of the theme state
type ThemeState = {
  mode: "light" | "dark";
};

// Function to get the initial theme from localStorage or default to "light"
const getInitialTheme = (): "light" | "dark" => {
  const savedTheme = localStorage.getItem("theme");
  return (savedTheme as "light" | "dark") || "light";
};

// Initial state of the theme slice
const initialState: ThemeState = {
  mode: getInitialTheme(),
};

// Create the theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.mode = state.mode === "light" ? "dark" : "light";
      localStorage.setItem("theme", state.mode);
    },
  },
});

// Export the action and reducer
export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;

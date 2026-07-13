import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

// Define the structure of the authentication state, which includes a token that can be either a string or null. The initial state is set based on the token stored in localStorage, allowing for persistent authentication across sessions.
type AuthState = {
  token: string | null;
};

// Retrieve the saved token from localStorage, if it exists, to initialize the authentication state. This allows the application to maintain the user's logged-in status even after a page refresh or browser restart.
const savedToken = localStorage.getItem("token");

// Define the initial state of the authentication slice, which includes the token retrieved from localStorage. If no token is found, the initial state will have a null token, indicating that the user is not authenticated.
const initialState: AuthState = {
  token: savedToken ?? null,
};

// Create the authentication slice using Redux Toolkit's createSlice function. This slice manages the authentication state, including actions for logging in and logging out users. The reducers update the state and handle localStorage to persist the authentication token.
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Define the login reducer, which updates the state with the provided token and stores it in localStorage for persistent authentication.
    login(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
    },

    // Define the logout reducer, which clears the token from the state and removes it from localStorage.
    logout(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

// Export the login and logout actions, as well as the reducer for the authentication slice. These exports allow other parts of the application to dispatch authentication actions and access the authentication state managed by this slice.
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
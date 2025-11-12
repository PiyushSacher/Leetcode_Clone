import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosClient from "./utils/axiosClient";

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/register", userData);
      return response.data.user;
    } catch (error) {
      // --- 1. FIXED: Handle non-serializable error ---
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/user/login", credentials);
      return response.data.user;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/check",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get("/user/check");
      return data.user;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosClient.post("/user/logout");
      return null;
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else if (error.message) {
        return rejectWithValue(error.message);
      } else {
        return rejectWithValue("An unknown error occurred");
      }
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true, // This should be true to prevent race conditions
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // 2. FIXED: Standardized rejected handler
    const handleRejected = (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;

      // Normalize the error message
      let errorMsg = "";
      if (action.payload) {
        if (typeof action.payload === "string") {
          errorMsg = action.payload;
        } else if (
          typeof action.payload === "object" &&
          action.payload.message
        ) {
          errorMsg = action.payload.message;
        } else {
          errorMsg = "An unknown error occurred";
        }
      } else {
        errorMsg = action.error?.message || "An unknown error occurred";
      }

      // Remove extra "Error:" prefix if present
      errorMsg = errorMsg.replace(/^Error:\s*/i, "");

      // Ignore invalid token message
      if (errorMsg.toLowerCase().includes("invalid token")) {
        state.error = null;
      } else {
        state.error = errorMsg;
      }
    };

    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.isAuthenticated = !!action.payload;
      state.user = action.payload;
      state.error = null;
    };

    builder
      //register user cases
      .addCase(registerUser.pending, handlePending)
      .addCase(registerUser.fulfilled, handleFulfilled)
      .addCase(registerUser.rejected, handleRejected)

      //login user cases
      .addCase(loginUser.pending, handlePending)
      .addCase(loginUser.fulfilled, handleFulfilled)
      .addCase(loginUser.rejected, handleRejected)

      //check auth cases
      .addCase(checkAuth.pending, handlePending)
      .addCase(checkAuth.fulfilled, handleFulfilled)
      .addCase(checkAuth.rejected, handleRejected)

      //logout user cases
      .addCase(logoutUser.pending, handlePending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, handleRejected);
  },
});

export default authSlice.reducer;

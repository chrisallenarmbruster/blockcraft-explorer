import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  latestBlocks: [],
  isLoading: false,
  error: null,
};

export const fetchLatestBlocks = createAsyncThunk(
  "latestBlocks/fetchLatestBlocks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/blocks/latest");
      console.log(response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        return rejectWithValue(
          `Server responded with status: ${error.response.status}`
        );
      } else if (error.request) {
        return rejectWithValue(
          "The server did not respond. Please try again later."
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const latestBlocksSlice = createSlice({
  name: "latestBlocks",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetLatestBlocks: (state) => {
      state.latestBlocks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLatestBlocks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLatestBlocks.fulfilled, (state, action) => {
        state.latestBlocks = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchLatestBlocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetLatestBlocks } = latestBlocksSlice.actions;
export default latestBlocksSlice.reducer;

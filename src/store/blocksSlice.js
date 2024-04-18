import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blocks: [],
  meta: {},
  isLoading: false,
  error: null,
};

export const fetchBlocks = createAsyncThunk(
  "blocksRange/fetchBlocks",
  async (
    { scope, sort, recordLimit, pageLimit, startIndex, page = 1 } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/blocks", {
        params: { scope, sort, page, pageLimit, recordLimit, startIndex },
      });

      return response.data;
    } catch (error) {
      if (error.response) {
        const message =
          error.response.data?.message ||
          `Server responded with status: ${error.response.status}`;
        return rejectWithValue(message);
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

const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetBlocks: (state) => {
      state.blocks = [];
      state.meta = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlocks.fulfilled, (state, action) => {
        state.blocks = action.payload.blocks;
        state.meta = action.payload.meta;
        state.isLoading = false;
      })
      .addCase(fetchBlocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetBlocks } = blocksSlice.actions;
export default blocksSlice.reducer;

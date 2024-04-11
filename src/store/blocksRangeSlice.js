import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blocks: [],
  isLoading: false,
  error: null,
};

export const fetchBlocksRange = createAsyncThunk(
  "blocksRange/fetchBlocksRange",
  async ({ radius, centerOnIndex } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (radius !== undefined) params.append("radius", radius);
      if (centerOnIndex !== undefined)
        params.append("centerOnIndex", centerOnIndex);
      const response = await axios.get(
        `/api/blocks/range?${params.toString()}`
      );

      return response.data.reverse();
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

const blocksRangeSlice = createSlice({
  name: "blocksRange",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetBlocks: (state) => {
      state.blocks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocksRange.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlocksRange.fulfilled, (state, action) => {
        state.blocks = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchBlocksRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetBlocks } = blocksRangeSlice.actions;
export default blocksRangeSlice.reducer;

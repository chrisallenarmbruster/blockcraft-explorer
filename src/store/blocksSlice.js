import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blocks: [],
  blockIds: {},
  isLoading: false,
  sort: "desc",
  lastFetchedIndex: null,
  nextIndexReference: null,
  error: null,
};

export const fetchBlocks = createAsyncThunk(
  "blocks/fetchBlocks",
  async (
    { startWithIndex = 0, limit = 100, sort = "asc" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `/api/blocks?limit=${limit}&sort=${sort}&startWithIndex=${startWithIndex}`
      );
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

export const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocks.pending, (state, action) => {
        if (!state.blocks.length) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlocks.fulfilled, (state, action) => {
        const { blocks, meta } = action.payload;

        const newBlocks = blocks.filter(
          (block) => !state.blockIds[block.index]
        );
        newBlocks.forEach((block) => (state.blockIds[block.index] = true));

        state.isLoading = false;
        state.blocks =
          state.sort === "asc"
            ? [...state.blocks, ...newBlocks]
            : [...newBlocks, ...state.blocks];

        state.lastFetchedIndex = meta.lastIndexInResponse;
        state.nextIndexReference = meta.nextIndexReference;
        state.sort = meta.sort;
        state.error = null;
      })
      .addCase(fetchBlocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blocksSlice.actions;
export default blocksSlice.reducer;

/*
  File: blocksRangeSlice.js
  Description: 
  This file defines the Redux slice for a range of blocks. It includes the slice's 
  initial state, reducers, and asynchronous actions.

  The initial state includes an array of blocks, a loading flag, and an error message.

  The `fetchBlocksRange` async action fetches a range of blocks from the server. It 
  takes an object with `radius` and `centerOnIndex` properties, which specify the 
  range of blocks to fetch. The action handles loading and error states, and formats 
  the server response before dispatching the fulfilled action.

  The slice includes reducers for resetting the error message and the blocks array. 
  It also includes extra reducers for handling the pending, fulfilled, and rejected 
  actions dispatched by `fetchBlocksRange`.

  The file exports the action creators and the reducer function for the slice.
*/

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  blocks: [],
  isLoading: false,
  error: null,
};

export const fetchBlocksRange = createAsyncThunk(
  "blocksRange/fetchBlocksRange",
  async (
    { scope, sort, recordLimit, pageLimit, startIndex } = {},
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("scope", scope);
      params.append("sort", sort);
      params.append("pageLimit", pageLimit);
      params.append("recordLimit", recordLimit);
      params.append("startIndex", startIndex);
      const response = await axios.get("/api/blocks", { params: params });

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
        state.blocks = action.payload.blocks;
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

/*
  File: blockchainIntegritySlice.js
  Description: This Redux slice manages the state and actions related to the blockchain integrity. It includes an async thunk to fetch the blockchain integrity from the node, and reducers to handle the different states of the fetch operation (pending, fulfilled, rejected). The slice also includes a reducer to reset any error that occurred during the fetch operation. The state includes the blockchain's validity, block count, hash validity, previous hash validity, timestamp validity, index validity, validation errors, loading status, and any error message when such data is applicable.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBlockchainIntegrity = createAsyncThunk(
  "blockchainIntegrity/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/chain/integrity");
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

export const blockchainIntegritySlice = createSlice({
  name: "blockchainIntegrity",
  initialState: {
    isValid: true,
    blockCount: 0,
    areHashesValid: true,
    arePreviousHashesValid: true,
    areTimestampsValid: true,
    areIndexesValid: true,
    validationErrors: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockchainIntegrity.pending, (state) => {
        if (!state.blockCount) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlockchainIntegrity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isValid = action.payload.isValid;
        state.blockCount = action.payload.blockCount;
        state.areHashesValid = action.payload.areHashesValid;
        state.arePreviousHashesValid = action.payload.arePreviousHashesValid;
        state.areTimestampsValid = action.payload.areTimestampsValid;
        state.areIndexesValid = action.payload.areIndexesValid;
        state.validationErrors = action.payload.errors || [];
        state.error = null;
      })
      .addCase(fetchBlockchainIntegrity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blockchainIntegritySlice.actions;

export default blockchainIntegritySlice.reducer;

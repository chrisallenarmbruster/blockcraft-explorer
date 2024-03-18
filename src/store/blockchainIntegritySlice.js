/*
  File: blockchainIntegritySlice.js
  Description: This Redux slice manages the state and actions related to the blockchain integrity. It includes an async thunk to fetch the blockchain integrity from the node, and reducers to handle the different states of the fetch operation (pending, fulfilled, rejected). The slice also includes a reducer to reset any error that occurred during the fetch operation. The state includes the blockchain's validity, block count, hash validity, previous hash validity, timestamp validity, index validity, validation errors, loading status, and any error message when such data is applicable.
*/

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchBlockchainIntegrity = createAsyncThunk(
  "blockchainIntegrity/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/chain/integrity");
      if (!response.ok) {
        throw new Error(`server responded with status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
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

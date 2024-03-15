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
        state.isLoading = true;
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

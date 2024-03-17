import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchBlockchainIntegrity } from "./blockchainIntegritySlice";

export const fetchBlockchainInfo = createAsyncThunk(
  "blockchainInfo/fetch",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await fetch("/api/chain/info");
      if (!response.ok) {
        throw new Error(`server responded with status: ${response.status}`);
      }
      const data = await response.json();
      dispatch(fetchBlockchainIntegrity());
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  blockchainName: "",
  bornOn: null,
  currentHeight: 0,
  hashRate: null,
  difficulty: null,
  totalSupply: null,
  isLoading: false,
  error: null,
};

const blockchainInfoSlice = createSlice({
  name: "blockchainInfo",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockchainInfo.pending, (state) => {
        if (!state.currentHeight) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlockchainInfo.fulfilled, (state, action) => {
        state.blockchainName = action.payload.blockchainName;
        state.bornOn = action.payload.bornOn;
        state.currentHeight = action.payload.currentHeight;
        if ("hashRate" in action.payload) {
          state.hashRate = action.payload.hashRate;
        }
        if ("difficulty" in action.payload) {
          state.difficulty = action.payload.difficulty;
        }
        if ("totalSupply" in action.payload) {
          state.totalSupply = action.payload.totalSupply;
        }
        state.isLoading = false;
        state.error = null;
      })
      .addCase(fetchBlockchainInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blockchainInfoSlice.actions;

export default blockchainInfoSlice.reducer;

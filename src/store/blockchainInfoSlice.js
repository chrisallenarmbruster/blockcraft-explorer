import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchBlockchainInfo = createAsyncThunk(
  "blockchainInfo/fetch",
  async (_, thunkAPI) => {
    try {
      const response = await fetch("/api/chain/info");
      if (!response.ok) {
        throw new Error(`server responded with status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message.toString());
    }
  }
);

const initialState = {
  blockchainName: "",
  bornOn: null,
  currentHeight: 0,
  difficulty: null,
  totalSupply: null,
  isLoading: false,
  error: null,
};

const blockchainInfoSlice = createSlice({
  name: "blockchainInfo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockchainInfo.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlockchainInfo.fulfilled, (state, action) => {
        state.blockchainName = action.payload.blockchainName;
        state.bornOn = action.payload.bornOn;
        state.currentHeight = action.payload.currentHeight;
        if ("difficulty" in action.payload) {
          state.difficulty = action.payload.difficulty;
        }
        if ("totalSupply" in action.payload) {
          state.totalSupply = action.payload.totalSupply;
        }
        state.isLoading = false;
      })
      .addCase(fetchBlockchainInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default blockchainInfoSlice.reducer;

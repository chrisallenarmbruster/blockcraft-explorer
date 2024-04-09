import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchBlockDetails = createAsyncThunk(
  "blockSelected/fetchDetails",
  async (blockIndex, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/block/${blockIndex}`);
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

const initialState = {
  selectedBlock: null,
  isLoading: false,
  error: null,
};

const blockSelectedSlice = createSlice({
  name: "blockSelected",
  initialState,
  reducers: {
    resetSelectedBlock: (state) => {
      state.selectedBlock = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlockDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBlockDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBlock = action.payload;
        state.error = null;
      })
      .addCase(fetchBlockDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSelectedBlock } = blockSelectedSlice.actions;
export default blockSelectedSlice.reducer;

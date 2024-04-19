import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEntryDetails = createAsyncThunk(
  "entrySelected/fetchDetails",
  async (entryIdentifier, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/entries/${entryIdentifier}`);
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
  selectedEntry: null,
  isLoading: false,
  error: null,
};

const entrySelectedSlice = createSlice({
  name: "entrySelected",
  initialState,
  reducers: {
    resetSelectedEntry: (state) => {
      state.selectedEntry = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntryDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEntryDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEntry = action.payload;
        state.error = null;
      })
      .addCase(fetchEntryDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetSelectedEntry } = entrySelectedSlice.actions;
export default entrySelectedSlice.reducer;

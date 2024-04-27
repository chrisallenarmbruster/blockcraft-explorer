import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  entries: [],
  meta: {},
  isLoading: false,
  error: null,
};

export const fetchEntries = createAsyncThunk(
  "entries/fetchEntries",
  async (
    { scope, sort, page, pageLimit, publicKey } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get("/api/entries", {
        params: { scope, sort, page, pageLimit, publicKey },
      });
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

const entriesSlice = createSlice({
  name: "entries",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetEntries: (state) => {
      state.entries = [];
      state.meta = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEntries.fulfilled, (state, action) => {
        state.entries = action.payload.entries;
        state.meta = action.payload.meta;
        state.isLoading = false;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetEntries } = entriesSlice.actions;

export default entriesSlice.reducer;

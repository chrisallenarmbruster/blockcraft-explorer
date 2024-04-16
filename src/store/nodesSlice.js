import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  nodes: [],
  isLoading: false,
  error: null,
};

export const fetchNodes = createAsyncThunk(
  "nodes/fetchNodes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/nodes");
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

const nodesSlice = createSlice({
  name: "nodes",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
    resetNodes: (state) => {
      state.nodes = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNodes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNodes.fulfilled, (state, action) => {
        state.nodes = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchNodes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError, resetNodes } = nodesSlice.actions;

export default nodesSlice.reducer;

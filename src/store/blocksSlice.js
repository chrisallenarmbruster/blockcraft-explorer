import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  blocks: [],
  blockIds: {},
  isLoading: false,
  hasNext: true,
  hasPrev: true,
  sort: "desc",
  lastFetchedIndex: null,
  nextIndexReference: null,
  error: null,
};

export const fetchBlocks = createAsyncThunk(
  "blocks/fetchBlocks",
  async (
    { startWithIndex = 0, limit = 10, sort = "asc" },
    { rejectWithValue }
  ) => {
    console.log(startWithIndex, limit, sort);
    try {
      const response = await fetch(
        `/api/blocks?limit=${limit}&sort=${sort}&startWithIndex=${startWithIndex}`
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const blocksSlice = createSlice({
  name: "blocks",
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlocks.pending, (state, action) => {
        if (!state.blocks.length) {
          state.isLoading = true;
        }
      })
      .addCase(fetchBlocks.fulfilled, (state, action) => {
        const { blocks, meta } = action.payload;

        const newBlocks = blocks.filter(
          (block) => !state.blockIds[block.index]
        );
        newBlocks.forEach((block) => (state.blockIds[block.index] = true));

        state.isLoading = false;
        state.blocks =
          state.sort === "asc"
            ? [...state.blocks, ...newBlocks]
            : [...newBlocks, ...state.blocks];

        state.lastFetchedIndex = meta.lastIndexInResponse;
        state.nextIndexReference = meta.nextIndexReference;
        state.hasNext =
          meta.sort === "asc" ? meta.nextIndexReference != null : true;
        state.hasPrev =
          meta.sort === "desc" ? meta.nextIndexReference != null : true;
        state.sort = meta.sort;
        state.error = null;
      })
      .addCase(fetchBlocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = blocksSlice.actions;
export default blocksSlice.reducer;

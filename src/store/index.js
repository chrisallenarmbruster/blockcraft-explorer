/*
  File: index.js
  Description: This file sets up the Redux store for the application. It imports the reducers from each of the redux slice files and combines them using the configureStore function from Redux Toolkit. The resulting store is then exported for use in the application.
*/

import { configureStore } from "@reduxjs/toolkit";
import blockchainInfoReducer from "./blockchainInfoSlice";
import blockchainIntegrityReducer from "./blockchainIntegritySlice";
import blocksReducer from "./blocksSlice";
import selectedBlockReducer from "./blockSelectedSlice";
import blocksRangeReducer from "./blocksRangeSlice";
import nodesReducer from "./nodesSlice";
import entriesReducer from "./entriesSlice";

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
    blockchainIntegrity: blockchainIntegrityReducer,
    blocks: blocksReducer,
    selectedBlock: selectedBlockReducer,
    blocksRange: blocksRangeReducer,
    nodes: nodesReducer,
    entries: entriesReducer,
  },
});

export default store;

import { configureStore } from "@reduxjs/toolkit";
import blockchainInfoReducer from "./blockchainInfoSlice";

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
  },
});

export default store;

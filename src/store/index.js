import { configureStore } from "@reduxjs/toolkit";
import blockchainInfoReducer from "./blockchainInfoSlice";
import blockchainIntegrityReducer from "./blockchainIntegritySlice";

const store = configureStore({
  reducer: {
    blockchainInfo: blockchainInfoReducer,
    blockchainIntegrity: blockchainIntegrityReducer,
  },
});

export default store;

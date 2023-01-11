import { configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { mapSlice } from "./mapSlice";
import searchSlice from "./searchSlice";

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, searchSlice);

const store = configureStore({
  reducer: {
    map: mapSlice.reducer,
    persist : persistedReducer,
  },
});

export default store;

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { mapSlice } from "./mapSlice";
import scrollSlice from "./scrollSlice";
import searchSlice from "./searchSlice";

const persistConfig = {
  key: "root",
  storage,
};

const reducers = combineReducers({
  scroll: scrollSlice,
  search: searchSlice,
})

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: {
    map: mapSlice.reducer,
    persist : persistedReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;

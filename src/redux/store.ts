import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import deviceSlice from "./slice/deviceSlice";
import { mapSlice } from "./slice/mapSlice";
import scrollSlice from "./slice/scrollSlice";
import searchSlice from "./slice/searchSlice";
import userSlice from "./slice/userSlice";

const persistConfig = {
  key: "root",
  storage,
};

const reducers = combineReducers({
  scroll: scrollSlice,
  search: searchSlice,
  user: userSlice,
  device: deviceSlice

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

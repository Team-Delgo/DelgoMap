import { createSlice } from "@reduxjs/toolkit";
import { Mungple } from "../components/maptype";

interface searchStateType {
  recentSearch: Mungple[];
}

const initialState: searchStateType = {
  recentSearch: [],
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setRecentSearch(state, action) {
      if (!state.recentSearch.find((e)=>e.placeName === action.payload.placeName)) {
        if (state.recentSearch.length >= 5) {
          state.recentSearch.pop();
        }
        state.recentSearch.unshift(action.payload);
      }
    },
    clearRecentSearch(state) {
      state.recentSearch = [];
    },
  },
});

export const searchAction = searchSlice.actions;

export default searchSlice.reducer;

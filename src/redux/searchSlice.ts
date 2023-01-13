import { createSlice } from "@reduxjs/toolkit";
import { Mungple } from "../components/maptype";

interface searchStateType {
  recentSearch: Mungple[];
  viewCount: number;
}

const initialState: searchStateType = {
  recentSearch: [],
  viewCount: 0
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setRecentSearch(state, action) {
      if (
        !state.recentSearch.find(
          (e) => e.placeName === action.payload.placeName
        )
      ) {
        if (state.recentSearch.length >= 5) {
          state.recentSearch.pop();
        }
        state.recentSearch.unshift(action.payload);
      }
    },
    clearRecentSearch(state) {
      state.recentSearch = [];
    },
    addViewCount(state) {
      state.viewCount += 1;
    }
  }
});

export const searchAction = searchSlice.actions;

export default searchSlice.reducer;

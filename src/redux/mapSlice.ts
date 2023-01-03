import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  zoom: 0,
  lat: 0,
  lng: 0,
  selectedIcon: 0,
  selectedArea: "송파"
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setCurrentPosition(state, action) {
      state = action.payload;
    },
    clearPosition(state) {
      state = initialState;
    }
  }
});

export const mapAction = mapSlice.actions;

export default mapSlice.reducer;

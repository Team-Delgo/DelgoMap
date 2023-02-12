import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  zoom: 0,
  lat: 0,
  lng: 0,
  selectedIcon: 0,
  selectedArea: "송파",
  link: "https://map.delgo.pet",
  isCopy: false,
  viewCount: 0,
  detailImgUrl: "",
  currentPlaceName: "",
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
    },
    setLink(state, action) {
      state.link = action.payload;
    },
    clearLink(state) {
      state.link = "https://map.delgo.pet";
    },
    setIsCopy(state) {
      state.isCopy = true;
    },
    setIsCopyFalse(state) {
      state.isCopy = false;
    },
    setViewCount(state) {
      state.viewCount += 1;
    },
    setDetailUrl(state, action){
      state.detailImgUrl = action.payload;
    },
    setCurrentPlaceName(state, action){
      state.currentPlaceName = action.payload;
    }
  }
});

export const mapAction = mapSlice.actions;

export default mapSlice.reducer;

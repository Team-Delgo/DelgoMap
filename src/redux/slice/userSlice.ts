import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSignIn: false,
  moveToLogin: false,
  appleCode: '',
  isFirstCert: true,
  isFirstCertToggle: false,
  user: {
    id: 0,
    address: '',
    nickname: '',
    email: '',
    phone: '',
    isSocial: false,
    geoCode: '',
    pGeoCode: '',
    registDt: '',
    notify: true,
  },
  pet: { name: '', petId: 0, birthday: '', breed: '', breedName: '', image: '' },
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signin(state, action) {
      return {
        ...state,
        isSignIn: true,
        moveToLogin: false,
        appleCode: '',
        user: action.payload.user,
        pet: action.payload.pet,
      };
    },
    signout() {
      return initialState;
    },
    redirectToLogin(state) {
      return {
        ...state,
        moveToLogin: true,
      };
    },
    redirectedToLogin(state) {
      return {
        ...state,
        moveToLogin: false,
      }
    },
    setpetprofile(state, action) {
      return {
        ...state,
        pet: {
          ...state.pet,
          image: action.payload.image,
        },
      };
    },
    changepetinfo(state, action) {
      return {
        ...state,
        pet: {
          name: action.payload.name,
          birthday: action.payload.birth,
          breed: action.payload.breed,
          breedName: action.payload.breedName,
          petId: state.pet.petId,
          image: action.payload.image,
        },
      };
    },
    changeGeoCode(state, action) {
      return {
        ...state,
        user: {
          ...state.user,
          address: action.payload.address,
          geoCode: action.payload.geoCode,
          pGeoCode: action.payload.pGeoCode,
        },
      };
    },
    changeNickName(state, action) {
      return {
        ...state,
        user: {
          ...state.user,
          nickname: action.payload.name,
        },
      };
    },
    changeNotification(state, action) {
      return {
        ...state,
        user: {
          ...state.user,
          notify: action.payload.notify,
        },
      };
    },
    setAppleCode(state, action) {
      return {
        ...state,
        appleCode: action.payload,
      };
    },
    setIsFisrtCert(state, action) {
      return { ...state, isFirstCert: action.payload };
    },
    setIsFirstCertToggle(state, action) {
      return { ...state, isFirstCertToggle: action.payload };
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';

interface initialStateType {
  prevImg:string,
  prevImgName:string,
  img: string,
  latitude: string,
  longitude: string,
  categoryKo: string,
  title: string,
  content: string,
  registDt: string,
  mongPlaceId: number,
  certificationId: number,
  tool: string,
  file: string,
  address: string,
  cert:string, // "", "mungple" , "manual"
  achievements:Array<AchievementType>,
  isHideAddress:boolean,
  categoryCode:string,
  prevImgList:Array<string>,
  prevImgNameList:Array<string>,
  imgList:Array<string>
  fileList:Array<File>,
}
interface AchievementType {
  achievementsId: number;
  desc: string;
  imgUrl: string;
  isActive: boolean;
  isMain: number;
  isMungple: boolean;
  name: string;
  registDt: string;
  achievementsCondition: Array<AchievementsConditionType>;
}

interface AchievementsConditionType {
  achievementsConditionId: number;
  mungpleId: number;
  categoryCode: string;
  count: number;
  conditionCheck: boolean;
  registDt: string;
}

const initialState: initialStateType = {
  prevImg:'',
  prevImgName:'',
  img: '',
  latitude: '',
  longitude: '',
  categoryKo: '',
  title: '',
  content: '',
  registDt: '',
  mongPlaceId: 0,
  certificationId: 0,
  tool: '',
  file: '',
  address: '',
  cert:"",
  achievements: [],
  isHideAddress:false,
  categoryCode:'',
  prevImgList:[],
  prevImgNameList:[],
  imgList:[],
  fileList:[],
};

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setUploadInit() {
      return {
        ...initialState,
      };
    },
    setPrevImg(state, action) {
      return {
        ...state,
        prevImg:action.payload.prevImg,
        prevImgName:action.payload.prevImgName

      };
    },
    setPrevImgList(state, action) {
      return {
        ...state,
        prevImgList:action.payload.prevImgList,
        prevImgNameList:action.payload.prevImgNameList

      };
    },
    setImg(state, action) {
      return {
        ...state,
        img: action.payload.img,
        tool: action.payload.tool,
        file: action.payload.file,
      };
    },
    setImgList(state, action) {
      return {
        ...state,
        imgList: action.payload.imgList,
        fileList: action.payload.fileList,
      };
    },
    setCategory(state, action) {
      return {
        ...state,
        categoryKo: action.payload.category,
      };
    },
    setMongPlace(state, action) {
      return {
        ...state,
        title: action.payload.placeName,
        mongPlaceId: action.payload.mungpleId,
        address:action.payload.address
      };
    },
    setManualPlace(state, action) {
      return {
        ...state,
        title: action.payload.placeName,
        address:action.payload.address,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        mongPlaceId:action.payload.mongPlaceId

      };
    },
    setContentRegistDtCertificationIdAddress(state, action) {
      return {
        ...state,
        content: action.payload.content,
        registDt: action.payload.registDt,
        certificationId: action.payload.certificationId,
        address: action.payload.address,
      };
    },
    setAchievements(state, action) {
      return {
        ...state,
        achievements: action.payload.achievements,
      };
    },
    setContent(state, action) {
      return {
        ...state,
        content: action.payload.content,
        achievements: action.payload.achievements,
      };
    },
    setCertificationUpdate(state, action) {
      return {
        ...initialState,
        imgList: action.payload.imgList,
        categoryKo: action.payload.categoryKo,
        title: action.payload.title,
        certificationId: action.payload.certificationId,
        content: action.payload.content,
        address: action.payload.address,
        isHideAddress:action.payload.isHideAddress
      };
    },
    setHomeCert(state,action) {
      return {
        ...initialState,
        prevImg:action.payload.prevImg,
        prevImgName:action.payload.prevImgName,
        latitude: action.payload.latitude,
        longitude: action.payload.longitude,
        mongPlaceId: action.payload.mongPlaceId,
        title: action.payload.title,
        address:action.payload.address,
        categoryCode:action.payload.categoryCode,
        cert:action.payload.cert
      };
    },
    setHideAddress(state,action) {
      return {
        ...state,
        isHideAddress:action.payload.isHideAddress
      };
    },
    setTitle(state,action) {
      return {
        ...state,
        title: action.payload.title,
      };
    },
    setCertificationId(state,action) {
      return {
        ...state,
        certificationId: action.payload.certificationId,
      };
    },
  },
});

export const uploadAction = uploadSlice.actions;
export default uploadSlice.reducer;
import React, { useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import VConsole from 'vconsole';
import Hammer from 'hammerjs';
import { useDispatch, useSelector } from 'react-redux';
import { AxiosResponse } from 'axios';
import './App.scss';
import {
  ACHIEVEMENT_PATH,
  APPLE_REDIRECT_HANDLE_PATH,
  CAMERA_PATH,
  CROP_PATH,
  KAKAO_REDIRECT_HANDLE_PATH,
  MY_ACCOUNT_PATH,
  NAVER_REDIRECT_HANDLE_PATH,
  POSTS_PATH,
  RECORD_PATH,
  SIGN_IN_PATH,
  SIGN_UP_PATH,
} from './common/constants/path.const';
import CaptureCertificationPage from './page/capture/CaptureCertificationPage';
import CaptureCertificationResultPage from './page/capture/CaptureCertificationResultPage';
import CaptureCertificationUpatePage from './page/capture/CaptureCertificationUpatePage';
import CaptureLocationPage from './page/capture/CaptureLocationPage';
import DetailPage from './page/DetailPage';
// import MapPage from "./page/map/MapPage";
import ChangePassword from './page/myaccount/ChangePassword';
import ChangePasswordCheck from './page/myaccount/ChangePasswordCheck';
import ChangeUserInfo from './page/myaccount/ChangeUserInfo';
import MyAccountPage from './page/myaccount/MyAccountPage';
import Setting from './page/myaccount/Setting';
import ServiceTerm from './page/myaccount/term/ServiceTerm';
import AchievePage from './page/record/achieve/AchievePage';
import AlbumPage from './page/record/album/AlbumPage';
import CalendarPage from './page/record/calendar/CalendarPage';
import FindPassword from './page/sign/password/FindPassword';
import PhoneAuth from './page/sign/password/PhoneAuth';
import ResetPassword from './page/sign/password/ResetPassword';
import Login from './page/sign/signin/Login';
import SignIn from './page/sign/signin/SignIn';
import AppleRedirectHandler from './page/sign/signin/social/AppleRedirectHandler';
import KakaoRedirectHandler from './page/sign/signin/social/KakaoRedirectHandler';
import NaverRedirectHandler from './page/sign/signin/social/NaverRedirectHandler';
import SocialExist from './page/sign/signin/social/SocialExist';
import SocialUserInfo from './page/sign/signin/social/SocialUserInfo';
import ChangePetInfo from './page/sign/signup/petinfo/ChangePetInfo';
import PetInfo from './page/sign/signup/petinfo/PetInfo';
import VerifyPhone from './page/sign/signup/phone/VerifyPhone';
import SignUpComplete from './page/sign/signup/SignUpComplete';
import Terms from './page/sign/signup/term/Terms';
import UserInfo from './page/sign/signup/userinfo/UserInfo';
import CropPage from './page/crop/CropPage';
import AchievementPage from './page/record/achieve/components/AchieveContainer';
import PostsPage from './page/certification/CertificationPostsPage';
import CommentsPage from './page/comment/CommentsPage';
import RecordCertificationPage from './page/certification/RecordCertificationPage';
import CertificationMap from './page/certification/CertificationMap';
import { deviceAction } from './redux/slice/deviceSlice';
import HelpPage from './page/help/HelpPage';
import { RootState } from './redux/store';
import { userActions } from './redux/slice/userSlice';
import { getMyInfo } from './common/api/myaccount';

import MapTest from './page/map/components/MapTest';
import RouterWrapper from './RouterWrapper';

function App() {
  const queryClient = new QueryClient();
  const dispatch = useDispatch();

  const { isSignIn, user } = useSelector((state: RootState) => state.persist.user);

  const vconsole = new VConsole();

  useEffect(() => {
    if (isSignIn) {
      getMyInfo(
        user.id,
        (response: AxiosResponse) => {
          const { code, data } = response.data;
          if (code === 200) {
            const { registDt } = data;
            dispatch(
              userActions.signin({
                isSignIn: true,
                user: {
                  id: data.userId,
                  address: data.address,
                  nickname: data.name,
                  email: data.email,
                  phone: data.phoneNo,
                  isSocial: false,
                  geoCode: data.geoCode,
                  registDt: `${registDt.slice(0, 4)}.${registDt.slice(5, 7)}.${registDt.slice(8, 10)}`,
                  notify: data.isNotify,
                },
                pet: {
                  petId: data.petId,
                  birthday: data.birthday,
                  breed: data.breed,
                  breedName: data.breedName,
                  name: data.petName,
                  image: data.profile,
                },
              }),
            );
          }
        },
        dispatch,
      );
    }
  }, []);

  useEffect(() => {
    const pcDevice = 'win16|win32|win64|mac|macintel';
    if (navigator.platform) {
      if (pcDevice.indexOf(navigator.platform.toLowerCase()) < 0) {
        dispatch(deviceAction.mobile());
      } else {
        dispatch(deviceAction.pc());
      }
    }
  }, []);

  useEffect(() => {
    const varUA = navigator.userAgent.toLowerCase();
    if (varUA.indexOf('android') > -1) {
      dispatch(deviceAction.android());
    } else if (
      varUA.indexOf('iphone') > -1 ||
      varUA.indexOf('ipad') > -1 ||
      varUA.indexOf('ipod') > -1
    ) {
      dispatch(deviceAction.ios());
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence>
        <BrowserRouter>
          <RouterWrapper>
            <Routes>
              {/* <Route path="/" element={<MapPage />} /> */}
              <Route path="/" element={<MapTest />} />
              <Route path="/:id" element={<MapTest />} />
              {/* <Route path="/:id" element={<MapPage />} /> */}
              <Route path="/help" element={<HelpPage />} />
              <Route path="/detail" element={<DetailPage />} />
              <Route path={SIGN_IN_PATH.MAIN} element={<SignIn />} />
              <Route path={SIGN_IN_PATH.SIGNIN} element={<Login />} />
              <Route path={SIGN_IN_PATH.FINDPASSWORD} element={<FindPassword />} />
              <Route path={SIGN_IN_PATH.PHONEAUTH} element={<PhoneAuth />} />
              <Route path={SIGN_IN_PATH.RESETPASSWORD} element={<ResetPassword />} />
              <Route path={SIGN_UP_PATH.TERMS} element={<Terms />} />
              <Route path={SIGN_UP_PATH.VERIFY} element={<VerifyPhone />} />
              <Route path={SIGN_UP_PATH.USER_INFO} element={<UserInfo />} />
              <Route path={SIGN_UP_PATH.SOCIAL.NICKNAME} element={<SocialUserInfo />} />
              <Route path={SIGN_UP_PATH.USER_PET_INFO} element={<PetInfo />} />
              <Route path={SIGN_UP_PATH.COMPLETE} element={<SignUpComplete />} />
              <Route path={SIGN_UP_PATH.SOCIAL.OTHER} element={<SocialExist />} />
              <Route path={RECORD_PATH.CALENDAR} element={<CalendarPage />} />
              <Route path={RECORD_PATH.PHOTO} element={<AlbumPage />} />
              <Route path={RECORD_PATH.ACHIEVE} element={<AchievePage />} />
              <Route path={RECORD_PATH.CERT} element={<RecordCertificationPage />} />
              <Route path={RECORD_PATH.COMMENT} element={<CommentsPage />} />
              <Route
                path={CAMERA_PATH.CERTIFICATION}
                element={<CaptureCertificationPage />}
              />
              <Route path={CAMERA_PATH.LOCATION} element={<CaptureLocationPage />} />
              <Route
                path={CAMERA_PATH.UPDATE}
                element={<CaptureCertificationUpatePage />}
              />
              <Route
                path={CAMERA_PATH.RESULT}
                element={<CaptureCertificationResultPage />}
              />
              <Route path={CAMERA_PATH.MAP} element={<CertificationMap />} />
              <Route path={CROP_PATH} element={<CropPage />} />
              <Route path={ACHIEVEMENT_PATH} element={<AchievementPage />} />
              <Route path={POSTS_PATH} element={<PostsPage />} />
              <Route path={MY_ACCOUNT_PATH.MAIN} element={<MyAccountPage />} />
              <Route path={MY_ACCOUNT_PATH.PETINFO} element={<ChangePetInfo />} />
              <Route path={MY_ACCOUNT_PATH.SETTINGS} element={<Setting />} />
              <Route path={MY_ACCOUNT_PATH.USERINFO} element={<ChangeUserInfo />} />
              <Route
                path={MY_ACCOUNT_PATH.PASSWORDCHECK}
                element={<ChangePasswordCheck />}
              />
              <Route path={MY_ACCOUNT_PATH.PASSWORDCHANGE} element={<ChangePassword />} />
              <Route path={MY_ACCOUNT_PATH.TERM1} element={<ServiceTerm id={1} />} />
              <Route path={MY_ACCOUNT_PATH.TERM2} element={<ServiceTerm id={2} />} />
              <Route
                path={KAKAO_REDIRECT_HANDLE_PATH}
                element={<KakaoRedirectHandler />}
              />
              <Route
                path={APPLE_REDIRECT_HANDLE_PATH}
                element={<AppleRedirectHandler />}
              />
              <Route
                path={NAVER_REDIRECT_HANDLE_PATH}
                element={<NaverRedirectHandler />}
              />
            </Routes>
          </RouterWrapper>
        </BrowserRouter>
      </AnimatePresence>
    </QueryClientProvider>
  );
}

export default App;

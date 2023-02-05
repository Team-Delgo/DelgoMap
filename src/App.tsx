import React from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.scss";
import { APPLE_REDIRECT_HANDLE_PATH, CAMERA_PATH, CROP_PATH, KAKAO_REDIRECT_HANDLE_PATH, MY_ACCOUNT_PATH, NAVER_REDIRECT_HANDLE_PATH, RECORD_PATH, SIGN_IN_PATH, SIGN_UP_PATH } from "./common/constants/path.const";
import CaptureCertificationPage from "./page/capture/CaptureCertificationPage";
import CaptureCertificationResultPage from "./page/capture/CaptureCertificationResultPage";
import CaptureCertificationUpatePage from "./page/capture/CaptureCertificationUpatePage";
import CaptureLocationPage from "./page/capture/CaptureLocationPage";
import CapturePage from "./page/capture/CapturePage";
import DetailPage from "./page/DetailPage";
import MapPage from "./page/map/MapPage";
import ChangePassword from "./page/myaccount/ChangePassword";
import ChangePasswordCheck from "./page/myaccount/ChangePasswordCheck";
import ChangeUserInfo from "./page/myaccount/ChangeUserInfo";
import MyAccountPage from "./page/myaccount/MyAccountPage";
import Setting from "./page/myaccount/Setting";
import ServiceTerm from "./page/myaccount/term/ServiceTerm";
import AchievePage from "./page/record/achieve/AchievePage";
import AlbumPage from "./page/record/album/AlbumPage";
import CalendarPage from "./page/record/calendar/CalendarPage";
import FindPassword from "./page/sign/password/FindPassword";
import PhoneAuth from "./page/sign/password/PhoneAuth";
import ResetPassword from "./page/sign/password/ResetPassword";
import Login from "./page/sign/signin/Login";
import SignIn from "./page/sign/signin/SignIn";
import AppleRedirectHandler from "./page/sign/signin/social/AppleRedirectHandler";
import KakaoRedirectHandler from "./page/sign/signin/social/KakaoRedirectHandler";
import NaverRedirectHandler from "./page/sign/signin/social/NaverRedirectHandler";
import SocialExist from "./page/sign/signin/social/SocialExist";
import SocialUserInfo from "./page/sign/signin/social/SocialUserInfo";
import ChangePetInfo from "./page/sign/signup/petinfo/ChangePetInfo";
import PetInfo from "./page/sign/signup/petinfo/PetInfo";
import VerifyPhone from "./page/sign/signup/phone/VerifyPhone";
import SignUpComplete from "./page/sign/signup/SignUpComplete";
import Terms from "./page/sign/signup/term/Terms";
import UserInfo from "./page/sign/signup/userinfo/UserInfo";
import CropPage from "./page/crop/CropPage"

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MapPage />} />
          <Route path="/:id" element={<MapPage />} />
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
          <Route path={CAMERA_PATH.CAPTURE} element={<CapturePage />} />
          <Route path={CAMERA_PATH.CERTIFICATION} element={<CaptureCertificationPage />} />
          <Route path={CAMERA_PATH.LOCATION} element={<CaptureLocationPage />} />
          <Route path={CAMERA_PATH.UPDATE} element={<CaptureCertificationUpatePage />} />
          <Route path={CAMERA_PATH.RESULT} element={<CaptureCertificationResultPage />} />
          <Route path={CROP_PATH} element={<CropPage />} />
          <Route path={MY_ACCOUNT_PATH.MAIN} element={<MyAccountPage />} />
          <Route path={MY_ACCOUNT_PATH.PETINFO} element={<ChangePetInfo />} />
          <Route path={MY_ACCOUNT_PATH.SETTINGS} element={<Setting />} />
          <Route path={MY_ACCOUNT_PATH.USERINFO} element={<ChangeUserInfo />} />
          <Route path={MY_ACCOUNT_PATH.PASSWORDCHECK} element={<ChangePasswordCheck />} />
          <Route path={MY_ACCOUNT_PATH.PASSWORDCHANGE} element={<ChangePassword />} />
          <Route path={MY_ACCOUNT_PATH.TERM1} element={<ServiceTerm id={1} />} />
          <Route path={MY_ACCOUNT_PATH.TERM2} element={<ServiceTerm id={2} />} />
          <Route path={KAKAO_REDIRECT_HANDLE_PATH} element={<KakaoRedirectHandler />} />
          <Route path={APPLE_REDIRECT_HANDLE_PATH} element={<AppleRedirectHandler />} />
          <Route path={NAVER_REDIRECT_HANDLE_PATH} element={<NaverRedirectHandler />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

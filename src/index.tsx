import React from "react";
import VConsole from "vconsole";
import { initializeApp } from "firebase/app";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { getAnalytics, logEvent } from "firebase/analytics";
import ReactDOM from "react-dom/client";
import { AxiosResponse } from "axios";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import store from "./redux/store";
import { getCurrentVersion } from "./common/api/version";


const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGE,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT
};

// const vconsole = new VConsole();

const app = initializeApp(firebaseConfig);

const persistor = persistStore(store);
window.Kakao.init('1fc2794c1008fd96115d7f57e7f68e04');

export const analytics = getAnalytics(app);
logEvent(analytics, "notification_received");

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

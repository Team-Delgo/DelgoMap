import React from "react";
import { initializeApp } from "firebase/app";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { getAnalytics, logEvent } from "firebase/analytics";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

const firebaseConfig = {
  apiKey: "AIzaSyAw18Fs8u3NsOxaco9L6OyHyICYb6HyDCs",
  authDomain: "delgomap-c4ca0.firebaseapp.com",
  projectId: "delgomap-c4ca0",
  storageBucket: "delgomap-c4ca0.appspot.com",
  messagingSenderId: "751246508342",
  appId: "1:751246508342:web:71f9041c5703d6ae6db397",
  measurementId: "G-H4RX9ZCL5R"
};


const app = initializeApp(firebaseConfig);

const persistor = persistStore(store);
window.Kakao.init('1fc2794c1008fd96115d7f57e7f68e04');

export const analytics = getAnalytics(app);
logEvent(analytics, "notification_received");

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

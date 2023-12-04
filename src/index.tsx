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
import * as Sentry from "@sentry/react";
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from "react-router-dom";


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


const app = initializeApp(firebaseConfig);

const persistor = persistStore(store);
window.Kakao.init('1fc2794c1008fd96115d7f57e7f68e04');

export const analytics = getAnalytics(app);
logEvent(analytics, "notification_received");

Sentry.init({
  dsn: "https://65bdb8fd8048335ea7d53620081db8d5@o4506330782498816.ingest.sentry.io/4506330822541312",
  integrations: [
    new Sentry.BrowserTracing({
      // See docs for support of different versions of variation of react router
      // https://docs.sentry.io/platforms/javascript/guides/react/configuration/integrations/react-router/
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
    new Sentry.Replay()
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

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

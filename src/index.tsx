import React from 'react';
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";
import './index.css';
import App from './App';
import store from './redux/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const firebaseConfig = {
  apiKey: "AIzaSyAw18Fs8u3NsOxaco9L6OyHyICYb6HyDCs",
  authDomain: "delgomap-c4ca0.firebaseapp.com",
  projectId: "delgomap-c4ca0",
  storageBucket: "delgomap-c4ca0.appspot.com",
  messagingSenderId: "751246508342",
  appId: "1:751246508342:web:eea89f1186f282b36db397",
  measurementId: "G-Z01M95BEQW"
};

const app = initializeApp(firebaseConfig);

export const analytics = getAnalytics(app);
logEvent(analytics, 'notification_received');

root.render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
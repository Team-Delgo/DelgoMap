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
  apiKey: "AIzaSyAbcJl2QUduGjVvoHE7d39yhQvTso0QVTw",
  authDomain: "delgo-c49bc.firebaseapp.com",
  projectId: "delgo-c49bc",
  storageBucket: "delgo-c49bc.appspot.com",
  messagingSenderId: "184505678344",
  appId: "1:184505678344:web:c65a45f1f295dd4b0bafbd",
  measurementId: "G-JSZ2SVJFBT"
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
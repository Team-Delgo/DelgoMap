import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import { RECORD_PATH } from './common/constants/path.const';
import DetailPage from './page/DetailPage';
import MapPage from './page/map/MapPage';
import AchievePage from './page/record/achieve/AchievePage';
import AlbumPage from './page/record/album/AlbumPage';
import CalendarPage from './page/record/calendar/CalendarPage';

function App() {
  const queryClient = new QueryClient();


  return <QueryClientProvider client={queryClient}><BrowserRouter>
    <Routes>
      <Route path='/' element={<MapPage />} />
      <Route path='/:id' element={<MapPage />} />
      <Route path='/detail' element={<DetailPage />} />
      <Route path={RECORD_PATH.CALENDAR} element={<CalendarPage/>} />
      <Route path={RECORD_PATH.PHOTO} element={<AlbumPage/>} />
      <Route path={RECORD_PATH.ACHIEVE} element={<AchievePage/>} />
    </Routes>
  </BrowserRouter>
  </QueryClientProvider>;
}

export default App;

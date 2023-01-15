import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import DetailPage from './page/DetailPage';
import MapPage from './page/map/MapPage';

function App() {
  const queryClient = new QueryClient();


  return <QueryClientProvider client={queryClient}><BrowserRouter>
    <Routes>
      <Route path='/' element={<MapPage />} />
      <Route path='/:id' element={<MapPage />} />
      <Route path='/detail' element={<DetailPage />} />
    </Routes>
  </BrowserRouter>
  </QueryClientProvider>;
}

export default App;

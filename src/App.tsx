import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import MapPage from './page/MapPage';

function App() {
  const queryClient = new QueryClient();


  return <QueryClientProvider client={queryClient}><BrowserRouter>
    <Routes>
      <Route path='/' element={<MapPage />} />
    </Routes>
  </BrowserRouter>
  </QueryClientProvider>;
}

export default App;

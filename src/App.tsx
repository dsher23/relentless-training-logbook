
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Add your routes here */}
        <Route index element={<div>Home Page</div>} />
      </Route>
    </Routes>
  );
};

export default App;

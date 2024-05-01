import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import Members from './pages/Members.js';

function App() {
  return (
    <>
      <BrowserRouter>
        <main>
          <section>
            <Routes>
              <Route path="/members" element={<Members />} />
            </Routes>
          </section>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import Members from './pages/Members.js';
import MemberDetail from './pages/MemberDetail.js';
import AddMember from './pages/AddMember.js';


function App() {
  return (
    <>
      <BrowserRouter>
        <main>
          <section>
            <Routes>
              <Route path="/members" element={<Members />} />
              <Route path="/members/:id" element={<MemberDetail />} />
              <Route path="/members/add" element={<AddMember />} />
            </Routes>
          </section>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;

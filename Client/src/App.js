import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import NavBar from './components/NavBar.js';
import Members from './pages/Members.js';
import MemberDetail from './pages/MemberDetail.js';
import AddMember from './pages/AddMember.js';
import EditMember from './pages/EditMember.js';
import Books from './pages/Books.js';
import BookDetail from './pages/BookDetail.js';
import AddBook from './pages/AddBook.js';
import EditBook from './pages/EditBook.js';
import SearchResults from './pages/SearchResults.js';
import ReturnBook from './pages/ReturnBook.js';

function App() {
  return (
    <>
      <BrowserRouter>

        <NavBar />

        <main>
          <section>
            <Routes>
              <Route path="/members" element={<Members />} />
              <Route path="/members/:id" element={<MemberDetail />} />
              <Route path="/members/add" element={<AddMember />} />
              <Route path="/members/:id/edit" element={<EditMember />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/books/add" element={<AddBook />} />
              <Route path="/books/:id/edit" element={<EditBook />} />
              <Route path="/books/search" element={<SearchResults />} />
              <Route path="/return-book" element={<ReturnBook />} />

            </Routes>
          </section>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;

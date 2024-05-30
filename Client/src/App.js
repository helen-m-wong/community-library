import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './App.css';

import NavBar from './components/NavBar.js';
import Members from './pages/Members/Members.js';
import MemberDetail from './pages/Members/MemberDetail.js';
import AddMember from './pages/Members/AddMember.js';
import EditMember from './pages/Members/EditMember.js';
import Books from './pages/Books.js';
import BookDetail from './pages/BookDetail.js';
import SearchResults from './pages/SearchResults.js';
import ReturnBook from './pages/ReturnBook.js';
import GoogleBooks from './pages/GoogleBook.js';
import GoogleBookDetail from './pages/GoogleBookDetail.js';

function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <main>
          <section>
            <Routes>
              <Route path="/members" element={<Members />} />
              <Route path="/members/:id" element={<MemberDetail />} />
              <Route path="/members/add" element={<AddMember />} />
              <Route path="/members/:id/edit" element={<EditMember />} />
              <Route path="/books" element={<Books />} />
              <Route path="/books/:id" element={<BookDetail />} />
              <Route path="/books/search" element={<SearchResults />} />
              <Route path="/return-book" element={<ReturnBook />} />
              <Route path="/search-book" element={<GoogleBooks />} />
              <Route path="/google-book/:id" element={<GoogleBookDetail />} />

            </Routes>
          </section>
        </main>
      </BrowserRouter>
    </>
  );
}

export default App;

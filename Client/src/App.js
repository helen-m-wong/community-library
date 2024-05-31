import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home.js';
import NavBar from './components/NavBar.js';
import Members from './pages/Members/Members.js';
import MemberDetail from './pages/Members/MemberDetail.js';
import AddMember from './pages/Members/AddMember.js';
import EditMember from './pages/Members/EditMember.js';
import Books from './pages/Books/Books.js';
import BookDetail from './pages/Books/BookDetail.js';
import SearchResults from './pages/Books/SearchResults.js';
import ReturnBook from './pages/Books/ReturnBook.js';
import GoogleBooks from './pages/GoogleBooks/GoogleBook.js';
import GoogleBookDetail from './pages/GoogleBooks/GoogleBookDetail.js';

function App() {

  return (
    <>
      <BrowserRouter>
        <NavBar/>
        <main>
          <section>
            <Routes>
              <Route path="/" element={<Home />} />
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

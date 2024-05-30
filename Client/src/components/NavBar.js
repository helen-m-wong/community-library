import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {


    return (
        <nav>
            <img src="/logo192.png" alt="App Icon" className="nav-icon" />
            <Link to="/">Home</Link>
            <Link to="/members">Members</Link>
            <Link to="/books">Books</Link>
            <Link to="/return-book">Returns</Link>
            <Link to="/search-book">Search Book</Link>
        </nav>
    );
}

export default NavBar;
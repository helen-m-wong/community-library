import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {

    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/members">Members</Link>
            <Link to="/books">Books</Link>
        </nav>
    );
}

export default NavBar;
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Books.css';

function SearchResults() {

    const {state} = useLocation();
    const { searchResults } = state;
    const navigate = useNavigate();
    
    const navToBooks = () => {
        navigate('/books');
    };

    return (
        <div className="books-container">
            <h2>Search Results</h2>
            {searchResults.length > 0 ? (
                <div className="books-grid">
                {searchResults.map((book) => (
                    <div key={book.id} className="book-item">
                        <Link className="book-title" to={`/books/${book.id}`}>
                            {book.cover && (
                                <img src={book.cover} alt={book.title} className="book-cover" />
                            )}
                            <div>{book.title}</div>
                        </Link>
                    </div>
                ))}
                </div>
            ) : (
                <p>No results matching your query were found</p>
            )}
            <button className="book-button" onClick={navToBooks}>Return to Books</button>
        </div>
    );
}

export default SearchResults;

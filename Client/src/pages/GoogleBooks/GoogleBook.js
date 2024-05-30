import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './GoogleBooks.css';

function GoogleBooks() {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    // Populates search results from passed state or resets state
    useEffect(() => {
        if (location.state && location.state.books) {
            setQuery(location.state.query);
            setBooks(location.state.books);
            setSearchInitiated(location.state.searchInitiated);
            setLoading(false);
        } else {
            setQuery('');
            setBooks([]);
            setError('');
            setSearchInitiated(false);
            setLoading(false);
        }
    }, [location]);

    const handleSearch = async () => {
        if (!query) {
            setError('Please enter a search query');
            return;
        }
        setError('');
        setSearchInitiated(true);
        setLoading(true); 
        try {
            const response = await fetch(`/search-books?query=${query}`);
            const data = await response.json();
            if (response.status === 200) {
                setBooks(data);
            } else {
                setError('Failed to fetch books');
            }
        } catch (err) {
            setError('An error occurred while fetching books');
        } finally {
            setLoading(false); 
        }
    };

    const cleanImageUrl = (url) => {
        return url.replace('&edge=curl', '');
    };

    return (
        <div className="google-container">
            <h2>Search for Book to Add to Library</h2>

            <div className="google-search-container">
                <input 
                    type="text" 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Enter book title or author"
                    className="search-input"
                />
                <button class="google-button" onClick={handleSearch}>Search</button>
            </div>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Loading...</p>}
            
            <div>
                {searchInitiated && !loading && books.length === 0 && <p>No books found</p>}
                {books.map((book) => (
                    <div key={book.id} className="google-items">
                        {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail && (
                            <img className="google-cover" src={cleanImageUrl(book.volumeInfo.imageLinks.thumbnail)} alt={book.volumeInfo.title}/>
                        )}
                        <div className="google-details">
                                <Link
                                    className="google-title"
                                    to={`/google-book/${book.id}`}
                                    state={{ books, query, searchInitiated }}>
                                    {book.volumeInfo.title}
                                </Link>
                            <p className="google-heading">Author: {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
                            <p className="google-heading">Genre: {book.volumeInfo.categories ? book.volumeInfo.categories[0] : 'Unknown'}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GoogleBooks;

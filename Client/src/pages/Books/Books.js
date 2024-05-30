import React, { useState, useEffect }  from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Books.css';

function Books() {

    const [books, setBooks] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [nextLink, setNextLink] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getBooks = async() => {
            try {
                const res = await fetch('/books');
                const data = await res.json();
                if (res.status === 200) {
                    console.log("Books data retrieved");
                    setBooks(data.books);
                    setNextLink(data.next);
                } else {
                    console.log("There was an error retrieving the data")
                }
            } catch (error) {
                console.log(error);
            }
        };
        getBooks();
    }, []);

    // Used to search all books
    useEffect(() => {
        const getAllBooks = async() => {
            try {
                const res = await fetch('/books/all');
                const data = await res.json();
                if (res.status === 200) {
                    console.log("All books data retrieved");
                    setAllBooks(data.books);
                } else {
                    console.log("There was an error retrieving the data")
                }
            } catch (error) {
                console.log(error);
            }
        };
        getAllBooks();
    }, []);

    const getNextBooks = async () => {
        try {
            const res = await fetch(nextLink);
            const data = await res.json();
            if (res.status === 200) {
                setBooks(prevBooks => [...prevBooks, ...data.books]);
                setNextLink(data.next);
            } else {
                console.log("There was an error retrieving the next set of books");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddBook = () => {
        navigate(`/search-book`);
    };

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleSearch = () => {
        const filteredBooks = allBooks.filter((book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase())
        );
        console.log(filteredBooks);
        console.log(filteredBooks.length);
        navigate('/books/search', { state: { searchResults: filteredBooks } });
    };

    return (
    <div className="books-container">
        <h2>Community Library</h2>
        <button className="book-button" onClick={handleAddBook}>Add Book</button>

        <div className="search-container">
            <input 
                type="text"
                placeholder="Search by title or author"
                value={searchQuery}
                onChange={handleSearchQueryChange}
                className="search-input"
            />
            <button className="book-button" onClick={handleSearch}>Search</button>
        </div>

        <div className="books-grid">
            {books.map((book) => (
                <div key={book.id} className="book-item">
                    <Link className="book-title" to={`/books/${book.id}`}>
                        {book.cover && (
                            <img className="book-cover" src={book.cover} alt={book.title}/>
                        )}
                        <div>{book.title}</div>
                    </Link>
                </div>
            ))}
        </div>

        {nextLink && (
            <button className="book-button" onClick={getNextBooks}>View More</button>
        )}
    </div>
    );
} 

export default Books;
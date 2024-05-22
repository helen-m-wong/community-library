import React, { useState, useEffect }  from 'react';
import { Link, useNavigate } from "react-router-dom";

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
        <>
            <h2>Community Library</h2>
            <Link to="/search-book">Add Book</Link>


            <input 
                type="text"
                placeholder="Search by title or author"
                value={searchQuery}
                onChange={handleSearchQueryChange}
            />
            <button onClick={handleSearch}>Search</button>


            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Owner</th>
                        <th>Borrower</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>
                            {book.cover && (
                                <img src={book.cover} alt={book.title} />
                            )}
                            </td>
                            <Link to={`/books/${book.id}`}>{book.title}</Link>
                            <td>{book.author}</td>
                            <td>{book.owner ? book.owner.name : 'None'}</td>
                            <td>{book.borrower ? book.borrower.name : 'None'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {nextLink && (
                <button onClick={getNextBooks}>View More</button>
            )}
        </>
    );
} 

export default Books;
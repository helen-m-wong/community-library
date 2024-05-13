import React, { useState, useEffect }  from 'react';
import { Link } from "react-router-dom";

function Books() {

    const [books, setBooks] = useState([]);
    const [searchTitle, setSearchTitle] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [nextLink, setNextLink] = useState(null);

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

    const handleSearchTitleChange = (event) => {
        setSearchTitle(event.target.value);
    };

    const handleSearch = () => {
        const filteredBooks = books.filter((book) =>
            book.title.toLowerCase().includes(searchTitle.toLowerCase())
        );
        setSearchResults(filteredBooks);
    };

    return (
        <>
            <h2>Books</h2>
            <Link to="/books/add">Add Book</Link>


            <input 
                type="text"
                placeholder="Search by title"
                value={searchTitle}
                onChange={handleSearchTitleChange}
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {searchResults.map((book) => (
                    <li key={book.id}>
                        {book.title} by {book.author}
                    </li>
                ))}
            </ul>


            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Owner</th>
                        <th>Borrower</th>
                    </tr>
                </thead>
                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
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
import React, { useState, useEffect }  from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import BorrowBook from '../../components/BorrowBook';
import './Books.css';

function BookDetail() {

    const { id } = useParams();
    console.log("Book ID:", id);

    const [book, setBook] = useState(null);
    const [showBorrowBook, setShowBorrowBook] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const getBook = async() => {
            try {
                const url = `/books/${id}`;
                console.log("Fetching book data from:", url);
                const response = await fetch(url);

                const data = await response.json();
                if (response.status === 200) {
                    console.log("Book data retrieved");
                    console.log(data);
                    setBook(data);
                } else {
                    console.log("There was an error retrieving the data")
                }
            } catch (error) {
                console.log(error);
            }
        };
        getBook();
    }, [id]);

    const deleteBook = async () => {

        const confirmation = window.confirm("Are you sure you want to delete this book?");

        if (confirmation) {
            try {
                const url = `/books/${id}`;
                const response = await fetch(url, {
                    method: 'DELETE'
                });
                if (response.status === 204) {
                    window.alert("Book successfully deleted from the community library");
                    console.log("Book deleted successfully")
                    navigate("/books");
                } else if (response.status === 403) {
                    window.alert("Please return book to the owner before deleting from the system");
                } else {
                    console.log("Error deleting book");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleBorrowBook = () => {
        setShowBorrowBook(true);
    };

    const handleConfirmBorrow = async (borrowerId, borrowerName) => {
        console.log('Borrower ID:', borrowerId);
        console.log('Borrower name:', borrowerName)

        try {
            const response = await fetch(`/books/${id}/members/${borrowerId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                console.log('Book borrowed successfully');
                setBook(prevBook => ({ ...prevBook,
                    borrower: {
                        name: `${borrowerName}`,
                        id: `${borrowerId}`
                        }
                    }));
                window.alert("Book borrowed successfully!");
            } else if (response.status === 403) {
                if (book.borrower.name === borrowerName) {
                    window.alert("You are already borrowing this book");
                } else {
                    window.alert("The book is already being borrowed");
                }
            } else {
                console.log('Error assigning borrower');
            }
        } catch (error) {
            console.log(error);
        } 
    };

    const handleViewAllBooks = () => {
        navigate('/books');
    };

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <div className="books-container">
            <h2>Book Details</h2>

            <div className="button-container"> 
                <button className="book-button" onClick={handleViewAllBooks}>View all Books</button>
                <button className="book-button" onClick={deleteBook}>Delete Book</button>
                <button className="book-button" onClick={handleBorrowBook}>Borrow Book</button>
            </div>

            {showBorrowBook && <BorrowBook onBorrow={handleConfirmBorrow} />}


            {book.cover && (
                <img src={book.cover} alt={book.title} className="book-cover" />
            )}

            <div className="book-info">
                <p>Title: {book.title}</p>
                <p>Author: {book.author}</p>
                <p>Genre: {book.genre}</p>
                <p>Publication Date: {book.pub_date}</p>
                <p>Owner: {book.owner ? (
                    <Link className="member-name" to={`/members/${book.owner.id}`}>{book.owner.name}</Link>
                ) : ('None')}</p>
                <p>Borrower: {book.borrower ? (
                    <Link className="member-name" to={`/members/${book.borrower.id}`}>{book.borrower.name}</Link>
                ) : ('None')}</p>
            </div>
        </div>
    );
} 

export default BookDetail;
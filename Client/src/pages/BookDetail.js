import React, { useState, useEffect }  from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import BorrowBook from '../components/BorrowBook';

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

    const handleEditBook = () => {
        navigate(`/books/${id}/edit`);
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
        <>
            <h2>Book Details</h2>
            <button onClick={handleViewAllBooks}>View all Books</button>
            <button onClick={handleEditBook}>Edit Book</button>
            <button onClick={deleteBook}>Delete Book</button>
            <button onClick={handleBorrowBook}>Borrow Book</button>
            {showBorrowBook && <BorrowBook onBorrow={handleConfirmBorrow} />}
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Publication Date: {book.pub_date}</p>
            <p>Owner: {book.owner ? book.owner.name : 'None'}</p>
            <p>Borrower: {book.borrower ? (
                <Link to={`/members/${book.borrower.id}`}>{book.borrower.name}</Link>
            ) : ('None')}</p>
        </>
    );
} 

export default BookDetail;
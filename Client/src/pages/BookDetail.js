import React, { useState, useEffect }  from 'react';
import { useParams, useNavigate } from "react-router-dom";

function BookDetail() {

    const { id } = useParams();
    console.log("Book ID:", id);

    const [book, setBook] = useState(null);
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

    if (!book) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h2>Book Details</h2>
            <button onClick={handleEditBook}>Edit Book</button>
            <button onClick={deleteBook}>Delete Book</button>
            <p>Title: {book.title}</p>
            <p>Author: {book.author}</p>
            <p>Publication Date: {book.pub_date}</p>
            <p>Owner: {book.owner ? book.owner.name : 'None'}</p>
            <p>Borrower: {book.borrower ? book.borrower.name : 'None'}</p>
        </>
    );
} 

export default BookDetail;
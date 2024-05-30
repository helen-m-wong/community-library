import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import DOMPurify from 'dompurify';
import OwnerSelection from '../components/SelectOwner';

function GoogleBookDetail() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [bookAdded, setBookAdded] = useState(false);
    const [bookId, setBookId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
                const data = await response.json();
                setBook(data);
            } catch (error) {
                console.log("Error fetching book details from Google Books API");
            }
        };
        fetchBookDetails();
    }, [id]);

    const handleAddToLibrary = async () => {
        const newBook = {
            cover: book.volumeInfo.imageLinks ? cleanImageUrl(book.volumeInfo.imageLinks.thumbnail) : null,
            title: book.volumeInfo.title,
            author: book.volumeInfo.authors.join(', '),
            genre: book.volumeInfo.categories[0],
            pub_date: book.volumeInfo.publishedDate
        };

        try {
            const response = await fetch('/books', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newBook)
            });
            if (response.status === 201) {
                console.log('Book added successfully');
                setBookAdded(true); 
                const data = await response.json();
                setBookId(data.id);
                window.alert("Please assign an owner to the book—this can't be changed later");
            } else {
                console.log("Error adding book");
            }
        } catch (error) {
            console.log(error);
        }
    };

    if (!book) {
        return <p>Loading...</p>;
    }

    const cleanImageUrl = (url) => {
        return url.replace('&edge=curl', '');
    };

    const handleOwnerSelection = async (ownerId, ownerName) => {
        const confirmSelection = window.confirm(`Are you sure you want to assign this book to ${ownerName}?`);
        if (confirmSelection) {
            try {
                const response = await fetch(`/members/${ownerId}/books/${bookId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
        
                if (response.status === 200) {
                    console.log("Owner assigned successfully");
                    window.alert("Owner assigned! You'll be redirected to the book's details page now");
                    navigate(`/books/${bookId}`);
                } else {
                    console.log('Error assigning owner');
                }
            } catch (error) {
                console.log(error);
            }
        }
    };
    
    return (
        <div>
            <h1>{book.volumeInfo.title}</h1>
            {book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail && (
                <img src={cleanImageUrl(book.volumeInfo.imageLinks.thumbnail)} alt={book.volumeInfo.title} />
            )}
            <button onClick={handleAddToLibrary}>Add to Library</button>
            <button onClick={() => {
                navigate('/search-book', { state: { books: location.state.books, query: location.state.query, searchInitiated: location.state.searchInitiated } });
            }}>
                Return to Search Results
            </button>
            {bookAdded && bookId !== null && <OwnerSelection onSelectOwner={handleOwnerSelection} />}
            <p>Author: {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown'}</p>
            <p>Genre: {book.volumeInfo.categories ? book.volumeInfo.categories[0] : 'Unknown'}</p>
            <p>Publication Date: {book.volumeInfo.publishedDate}</p>
            <p>Publisher: {book.volumeInfo.publisher ? book.volumeInfo.publisher : 'Unknown'}</p>
            <p>Description:</p>
            <p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(book.volumeInfo.description) }}></p>
        </div>
    );
}

export default GoogleBookDetail;

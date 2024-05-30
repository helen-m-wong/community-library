import React, { useState, useEffect } from 'react';
import './Books.css';

function ReturnBook() {
    const [members, setMembers] = useState([]);
    const [selectedMember, setSelectedMember] = useState('');
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');

    useEffect(() => {
        const getMembers = async () => {
            try {
                const res = await fetch('/members');
                if (res.status === 200) {
                    const data = await res.json();
                    setMembers(data.members);
                } else {
                    console.log("There was an error retrieving the data");
                }
            } catch (error) {
                console.log(error);
            }
        };
        getMembers();
    }, []);

    useEffect(() => {
        const getBorrowedBooks = async () => {
            try {
                const res = await fetch(`/members/${selectedMember}`);
                if (res.status === 200) {
                    const data = await res.json();
                    console.log(data);
                    setBorrowedBooks(data.borrowed_books);
                } else {
                    console.log("There was an error retrieving the data");
                }
            } catch (error) {
                console.log(error);
            }
        };

        if (selectedMember) {
            getBorrowedBooks();
        }
    }, [selectedMember]);

    const handleSelectMember = (e) => {
        setSelectedMember(e.target.value);
    };

    const handleSelectBook = (e) => {
        setSelectedBook(e.target.value);
    };

    const handleReturnBook = async () => {
        try {
            const res = await fetch(`/members/${selectedMember}/books/${selectedBook}`, {
                method: 'DELETE'
            });
            if (res.status === 204) {
                console.log("Book returned successfully");
                setSelectedMember('');
                window.alert("Book returned successfully!"); 
            } else {
                console.log("There was an error returning the book");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="books-container">
            <h2>Return a Book</h2>
                <p>Who's returning the book?</p>
                <select value={selectedMember} onChange={handleSelectMember}>
                    <option value="">Select Member</option>
                    {members.map(member => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
                {selectedMember && (
                    <>
                        <p>Which book do you want to return?</p>
                        <select className="title-select" value={selectedBook} onChange={handleSelectBook}>
                            <option value="">Select Book</option>
                            {borrowedBooks.map(book => (
                                <option key={book.id} value={book.id}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                        <button className="book-button" onClick={handleReturnBook}>Return this Book</button>
                    </>
                )}
        </div>
    );
}

export default ReturnBook;

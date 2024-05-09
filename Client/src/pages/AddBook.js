import React, { useState }  from 'react';
import { useNavigate } from "react-router-dom";

function AddBook() {

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [pub_date, setPubDate] = useState('');
    const navigate = useNavigate();

    const addBook = async () => {
        const newBook = { title, author, pub_date };

        try {
            const response = await fetch('/books', {
                method: 'POST',
                body: JSON.stringify(newBook),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if(response.status === 201){
                console.log('Book added successfully');
                navigate("/books");
            } else {
                console.log("Error adding book")
                navigate("/books");
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
        <article>
            <h2>Add a Book</h2>
            <form onSubmit={(e) => { e.preventDefault();}}>
                <fieldset>
                    <label for="title" className="required">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)} 
                        id="title" />
                    
                    <label for="author" className="required">Author</label>
                    <input
                        type="text"
                        value={author}
                        onChange={e => setAuthor(e.target.value)} 
                        id="author" />

                    <label for="pub_date" className="required">Publication Date</label>
                    <input
                        type="text"
                        value={pub_date}
                        onChange={e => setPubDate(e.target.value)} 
                        id="pub_date" />

                    <label for="submit">
                    <button
                        type="submit"
                        onClick={addBook}
                        id="submit"
                    >Add</button> to the collection</label>
                </fieldset>
                </form>
            </article>
        </>
    );
  }
  
  export default AddBook;
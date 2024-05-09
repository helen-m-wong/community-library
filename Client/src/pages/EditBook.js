import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from "react-router-dom";

function EditBook() {

    const { id } = useParams();
    console.log("Book ID:", id);

    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [pub_date, setPubDate] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getBook = async () => {
            try {
                const url = `/books/${id}`;
                console.log("Fetching book data from:", url);
                const res = await fetch(url);

                const data = await res.json();
                if (res.status === 200) {
                    console.log("Book data retrieved");
                    setTitle(data.title);
                    setAuthor(data.author);
                    setPubDate(data.pub_date);
                } else {
                    console.log("There was an error retrieving the data")
                }
            } catch (error) {
                console.log(error);
            }
        };
        getBook();
    }, [id]);

    const editBook = async () => {
        try {
            const url = `/books/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "title": title, "author": author, "pub_date": pub_date })
            });
            if (response.status === 200) {
                console.log("Book data updated successfully");
                navigate(url);
            } else {
                console.log("Error updating book data");
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <h2>Edit Book</h2>
            <form onSubmit={(e) => {e.preventDefault();}}>
                <fieldset>
                    <label for="title">Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        value={title} 
                        onChange={e => setTitle(e.target.value)}
                        id="title"/>
                    <label for="author">Author</label>
                    <input
                        type="text"
                        name="author"
                        value={author}
                        onChange={e => setAuthor(e.target.value)}
                        id="author"/>
                    <label for="pub_date">Publication Date</label>
                    <input
                        type="text"
                        name="pub_date"
                        value={pub_date}
                        onChange={e => setPubDate(e.target.value)}
                        id="address"/>
                    <button
                        type="submit"
                        onClick={editBook}
                        id="submit">Save</button>
                </fieldset>
            </form>
        </>
    );
} 

export default EditBook;
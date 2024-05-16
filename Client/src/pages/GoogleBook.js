import React, { useState, useEffect }  from 'react';
import { Link, useNavigate } from "react-router-dom";

function GoogleBooks() {

    const [search, setSearch] = useState("");
    const [result, setResult] = useState([]);
    const apiKey = "AIzaSyB8gbPsdRAELCrgKitYMPgTVzGmXLxfodQ"
  
    function handleChange(event) {
      const search = event.target.value
      setSearch(search);
    }
  
    function handleSubmit(event) {
      event.preventDefault();
      console.log("https://www.googleapis.com/books/v1/volumes?q="+search+"&key="+apiKey+"&maxResults=20")
      fetch("https://www.googleapis.com/books/v1/volumes?q="+ search+"&key="+apiKey+"&maxResults=20")
        .then(response => {
          return response.json()
        })
        .then(data => {
          console.log(data.items)
          setResult(data.items);
        })
    }
  

    return (
        <div className="App">
        <form onSubmit={handleSubmit}>
          <div className="Form">
            <input type="text" 
            onChange={handleChange}
            placeholder="Search for book"/>
          </div>
          <button type="submit">Search</button>
        </form>

        {result.map(search => (
          <img src={search.volumeInfo.imageLinks.thumbnail} alt={search.volumeInfo.title}/>
        ))}
        </div>
    );
} 

export default GoogleBooks;
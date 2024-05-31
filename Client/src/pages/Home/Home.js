import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="img-container">
        <div className="welcome-text-container">
          <h1 className="welcome-text">Welcome</h1>
        </div>
      </div>

      <div className="text-below-image">
        <h2>About</h2>
        <p>Hi there! This web application is a community library platform that allows members to search for books using the Google Books API and add books to a community library. Members can search for books by title or author, view detailed information about each book, and add books to a community library which is stored using Google Datastore. The application is built using React for the front-end, providing a dynamic and interactive user interface. The back-end, which handles data storage and retrieval, is powered by a Node.js server that interacts with Google Datastore. The application employs RESTful API principles for communication between the front-end and back-end. Overall, this app is meant to be used within a small community and aims to provide a user-friendly book searching and cataloging service. </p>
      </div>
    </div>
  );
};

export default Home;
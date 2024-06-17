# Community Library App

## Overview

Welcome to my Community Library app! This project allows users to search for books using the Google Books API and add selected books to a community library. The app also allows for the management of community library members. The app is currently deployed, with the backend hosted on Google Cloud and the frontend on Firebase.

## Features

* View Books: All books added to the community library are displayed in a grid format with their cover and title for users to view. Book details, including author, genre, publication date, and description, can be accessed by clicking on the cover or title.
<img width="1455" alt="View books in library" src="https://github.com/helen-m-wong/community-library/assets/108026042/5dcde572-a74c-4f5b-9acf-de4cf11e10da">

* Book Search: Users can search for books by title or author using the Google Books API and add desired books to the community library, which stores books using Google Datastore.
<img width="1460" alt="Book Search using Google Books API" src="https://github.com/helen-m-wong/community-library/assets/108026042/3e2432c6-1d67-4222-812f-f019a9871562">

* Manage Community Members: Users can view member details and add, remove, or edit members of the community library.
* Borrow/Return Books: Members can borrow books from the library and easily return them. The app keeps track of borrowed books, and you can view which member has borrowed or owns a book by checking the member's detail page.

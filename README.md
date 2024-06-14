# Community Library App

## Overview

Welcome to my Community Library app! This project allows users to search for books using the Google Books API and add selected books to a community library. The app also allows for the management of community library members. The app is currently deployed, with the backend hosted on Google Cloud and the frontend on Firebase.

## Features

* Book Search: Users can search for books by title or author using the Google Books API and add desired books to the community library, which stores books using Google Datastore.
* View Books: All books added to the community library are displayed in a grid format with their cover and title for users to view. Book details, including author, genre, publication date, and description, can be accessed by clicking on the cover or title.
* Manage Community Members: Users can view member details and add, remove, or edit members of the community library.
* Borrow/Return Books: Members can borrow books from the library and easily return them. The app keeps track of borrowed books, and you can view which member has borrowed or owns a book by checking the member's detail page.

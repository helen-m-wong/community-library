import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

function SearchResults() {

    const {state} = useLocation();
    const { searchResults } = state;
    const navigate = useNavigate();
    
    const navToBooks = () => {
        navigate('/books');
    };

    return (
        <>
            <h2>Search Results</h2>
            {searchResults.length > 0 ? (
                <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Owner</th>
                        <th>Borrower</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.map((book) => (
                        <tr key={book.id}>
                            <td><Link to={`/books/${book.id}`}>{book.title}</Link></td>
                            <td>{book.author}</td>
                            <td>{book.owner ? book.owner.name : 'None'}</td>
                            <td>{book.borrower ? book.borrower.name : 'None'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            ) : (
                <p>No results matching your query were found</p>
            )}
            <button onClick={navToBooks}>Back to Books</button>
        </>
    );
}

export default SearchResults;

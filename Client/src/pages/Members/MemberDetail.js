import React, { useState, useEffect }  from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import './Members.css';

function MemberDetail() {

    const { id } = useParams();
    const [member, setMember] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getMember = async() => {
            try {
                const url = `/members/${id}`;
                const response = await fetch(url);
                const data = await response.json();
                if (response.status === 200) {
                    console.log("Member data retrieved");
                    setMember(data);
                } else {
                    console.log("There was an error retrieving the data")
                }
            } catch (error) {
                console.log(error);
            }
        };
        getMember();
    }, [id]);

    const deleteMember = async () => {
        const confirmation = window.confirm("Are you sure you want to delete this member?");
        if (confirmation) {
            try {
                const url = `/members/${id}`;
                const response = await fetch(url, {
                    method: 'DELETE'
                });
                if (response.status === 204) {
                    console.log("Member deleted successfully")
                    navigate("/members");
                } else if (response.status === 403) {
                    window.alert("Please return member's borrowed books and delete their owned books from the system first");
                } else {
                    console.log("Error deleting member");
                }
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleViewAllMembers = () => {
        navigate('/members');
    };

    const handleEditMember = () => {
        navigate(`/members/${id}/edit`);
    };

    if (!member) {
        return <div>Loading...</div>;
    }

    return (
        <div className="member-container">
            <h2>Member Details</h2>

            <div className="button-container">
                <button className="member-button" onClick={handleViewAllMembers}>View all Members</button>
                <button className="member-button" onClick={handleEditMember}>Edit Member</button>
                <button className="member-button" onClick={deleteMember}>Delete Member</button>
            </div>

            <div className="member-info">
            <p>Name: {member.name}</p>
            <p>Email: {member.email}</p>
            <p>Address: {member.address}</p>
            </div>

            <h3>Owned Books</h3>
            {member.owned_books && member.owned_books.length > 0 ? (
                <table className="members">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {member.owned_books.map((book) => (
                            <tr key={book.id}>
                                <td>
                                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                                </td>
                                <td>{book.author}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No books owned</p>
            )}

            <h3>Borrowed Books</h3>
            {member.borrowed_books && member.borrowed_books.length > 0 ? (
                <table className="members">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                        </tr>
                    </thead>
                    <tbody>
                        {member.borrowed_books.map((book) => (
                            <tr key={book.id}>
                                <td>
                                    <Link to={`/books/${book.id}`}>{book.title}</Link>
                                </td>
                                <td>{book.author}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No books borrowed</p>
            )}
        </div>
    );
} 

export default MemberDetail;
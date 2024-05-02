import React, { useState, useEffect }  from 'react';
import { useParams } from "react-router-dom";

function MemberDetail() {

    const { id } = useParams();
    console.log("Member ID:", id);

    const [member, setMember] = useState(null);

    useEffect(() => {
        const getMember = async() => {
            try {
                const url = `/members/${id}`;
                console.log("Fetching member data from:", url);
                const res = await fetch(url);

                const data = await res.json();
                if (res.status === 200) {
                    console.log("member data retrieved");
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

    if (!member) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <h2>Member Details</h2>
            <p>Name: {member.name}</p>
            <p>Email: {member.email}</p>
            <p>Address: {member.address}</p>
            <h3>Owned Books</h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {member.owned_books.map((book) => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h3>Borrowed Books</h3>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                    </tr>
                </thead>
                <tbody>
                    {member.borrowed_books.map((book) => (
                        <tr key={book.id}>
                            <td>{book.title}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
} 

export default MemberDetail;
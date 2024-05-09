import React, { useState, useEffect }  from 'react';
import { Link } from "react-router-dom";

function Members() {

    const [members, setMembers] = useState([]);

    useEffect(() => {
        const getMembers = async() => {
            try {
                const res = await fetch('/members');
                const data = await res.json();
                if (res.status === 200) {
                    console.log("Members data retrieved");
                    setMembers(data.members);
                } else {
                    console.log("There was an error retrieving the data")
                }
            } catch (error) {
                console.log(error);
            }
        };
        getMembers();
    }, []);

    return (
        <>
            <h2>Members</h2>
            <Link to="/members/add">Add Member</Link>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Address</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map((member) => (
                        <tr key={member.id}>
                            <td>
                                <Link to={`/members/${member.id}`}>{member.name}</Link>
                            </td>
                            <td>{member.email}</td>
                            <td>{member.address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
} 

export default Members;
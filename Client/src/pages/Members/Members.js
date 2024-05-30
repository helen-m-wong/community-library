import React, { useState, useEffect }  from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Members.css';

function Members() {

    const [members, setMembers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getMembers = async() => {
            try {
                const res = await fetch('/members');
                const data = await res.json();
                if (res.status === 200) {
                    console.log("Members data retrieved");
                    setMembers(data.members);
                } else {
                    console.log("There was an error retrieving the data");
                }
            } catch (error) {
                console.log(error);
            }
        };
        getMembers();
    }, []);

    const handleAddMember = () => {
        navigate(`/members/add`);
    };

    return (
        <div className="members-container">
            <h2>Members</h2>
            <button className="member-button" onClick={handleAddMember}>Add Member</button>
            <table className="members">
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
        </div>
    );
} 

export default Members;
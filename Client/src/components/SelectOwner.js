import React, { useState, useEffect } from 'react';
import '../pages/GoogleBooks/GoogleBooks.css';

function OwnerSelection({ onSelectOwner }) {
    const [members, setMembers] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState('');
    const API_URL = "https://community-library-410206.wl.r.appspot.com";

    useEffect(() => {
        const getMembers = async() => {
            try {
                const res = await fetch(API_URL + '/members');
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

    const handleOwnerChange = (e) => {
        setSelectedOwner(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedOwner) {
            const selectedMember = members.find(member => member.id === selectedOwner);
            if (selectedMember) {
                onSelectOwner(selectedMember.id, selectedMember.name);
            }
        }
    }

    return (
        <div>
            <h2>Select Owner</h2>
            <form onSubmit={handleSubmit}>
                <select value={selectedOwner} onChange={handleOwnerChange}>
                    <option value="">Select Owner</option>
                    {members.map(member => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
                <button className="google-button" type="submit">Assign Owner</button>
            </form>
        </div>
    );
}

export default OwnerSelection;

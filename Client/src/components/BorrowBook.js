import React, { useState, useEffect } from 'react';
import '../pages/Books/Books.css';

function BorrowBook({ onBorrow }) {
    const [members, setMembers] = useState([]);
    const [selectedBorrower, setSelectedBorrower] = useState('');
    const API_URL = "https://community-library-410206.wl.r.appspot.com";

    useEffect(() => {
        const getMembers = async () => {
            try {
                const res = await fetch(API_URL + '/members');
                if (res.status === 200) {
                    const data = await res.json();
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

    const handleConfirmBorrow = () => {
        if (selectedBorrower) {
            const selectedMember = members.find(member => member.id === selectedBorrower);
            if (selectedMember) {
                onBorrow(selectedMember.id, selectedMember.name);
            }
        }
    };

    return (
        <div>
            <h3>Who's borrowing the book?</h3>
            <div>
                <select value={selectedBorrower} onChange={(e) => setSelectedBorrower(e.target.value)}>
                    <option value="">Select Member</option>
                    {members.map((member) => (
                        <option key={member.id} value={member.id}>
                            {member.name}
                        </option>
                    ))}
                </select>
            
            <button className="book-button" onClick={handleConfirmBorrow}>Confirm Borrow</button>
            </div>
            
        </div>
    );
}

export default BorrowBook;

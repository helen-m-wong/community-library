import React, { useState }  from 'react';
import { useNavigate } from "react-router-dom";

function AddMember() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const addMember = async () => {
        const newMember = { name, email, address };

        try {
            const response = await fetch('/members', {
                method: 'POST',
                body: JSON.stringify(newMember),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if(response.status === 201){
                console.log('Member added successfully');
                navigate("/members");
            } else {
                console.log("Error adding member")
                navigate("/members");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const navToMembers = () => {
        navigate('/members');
    };

    return (
        <>
        <article>
            <h2>Add a Member</h2>
            <form onSubmit={(e) => { e.preventDefault();}}>
                <fieldset>
                    <label htmlFor="name" className="required">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)} 
                        id="name" />
                    
                    <label htmlFor="email" className="required">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)} 
                        id="email" />

                    <label htmlFor="address" className="required">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)} 
                        id="address" />

                    <button type="submit" onClick={addMember} id="submit">
                        Add
                    </button>
                </fieldset>
                </form>
            </article>
            <button onClick={navToMembers}>Back to Members</button>

        </>
    );
  }
  
  export default AddMember;
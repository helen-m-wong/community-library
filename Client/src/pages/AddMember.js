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

    return (
        <>
        <article>
            <h2>Add a Member</h2>
            <form onSubmit={(e) => { e.preventDefault();}}>
                <fieldset>
                    <label for="name" className="required">Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)} 
                        id="name" />
                    
                    <label for="email" className="required">Email</label>
                    <input
                        type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)} 
                        id="email" />

                    <label for="address" className="required">Address</label>
                    <input
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)} 
                        id="address" />

                    <label for="submit">
                    <button
                        type="submit"
                        onClick={addMember}
                        id="submit"
                    >Add</button> to the collection</label>
                </fieldset>
                </form>
            </article>
        </>
    );
  }
  
  export default AddMember;
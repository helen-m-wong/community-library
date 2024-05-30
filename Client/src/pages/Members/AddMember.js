import React, { useState }  from 'react';
import { useNavigate } from "react-router-dom";
import './Members.css';

function AddMember() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    const addMember = async (e) => {
        e.preventDefault();
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
        <div className="member-container">
            <h2>Add a Member</h2>
            <form className="member-form" onSubmit={addMember}>
                <div className="col-10">
                    <label htmlFor="name" className="required">Name</label>
                </div>
                <div className="col-90">
                    <input
                        className="member-input"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)} 
                        id="name"
                        required/>
                </div>

                <div className="col-10">
                    <label htmlFor="email" className="required">Email</label>
                </div>
                <div className="col-90">
                    <input
                        className="member-input"
                        type="text"
                        value={email}
                        onChange={e => setEmail(e.target.value)} 
                        id="email" 
                        required />
                </div>

                <div className="col-10">
                    <label htmlFor="address" className="required">Address</label>
                </div>
                <div className="col-90">
                    <input
                        className="member-input"
                        type="text"
                        value={address}
                        onChange={e => setAddress(e.target.value)} 
                        id="address" />
                </div>
                    <button className="member-button" type="submit" id="submit">
                        Add
                    </button>
                </form>
            <br></br>
            <button className="member-button" onClick={navToMembers}>Back to Members</button>
        </div>
    );
  }
  
  export default AddMember;
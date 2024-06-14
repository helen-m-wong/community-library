import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from "react-router-dom";
import './Members.css';

function EditMember() {

    const { id } = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();
    const API_URL = "https://community-library-410206.wl.r.appspot.com";

    useEffect(() => {
        const getMember = async () => {
            try {
                const url = API_URL + `/members/${id}`;
                console.log("Fetching member data from:", url);
                const res = await fetch(url);
                const data = await res.json();
                if (res.status === 200) {
                    console.log("member data retrieved");
                    setName(data.name);
                    setEmail(data.email);
                    setAddress(data.address);
                } else {
                    console.log("There was an error retrieving the data")
                }
            } catch (error) {
                console.log(error);
            }
        };
        getMember();
    }, [id]);

    const editMember = async (e) => {
        e.preventDefault();
        try {
            const url = API_URL + `/members/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "name": name, "email": email, "address": address })
            });
            if (response.status === 200) {
                console.log("Member data updated successfully");
                navigate(`/members/${id}`);
            } else {
                console.log("Error updating member data");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const navToMember = () => {
        navigate(`/members/${id}`);
    };

    return (
        <div className="member-container">
            <h2>Edit Member</h2>
            <form className="member-form" onSubmit={editMember}>
                <div className="col-10">
                    <label for="name">Name</label>
                </div>
                <div className="col-90">
                    <input 
                        type="text" 
                        name="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        id="name"
                        required />
                </div>

                <div className="col-10">
                    <label for="email">Email</label>
                </div>
                <div className="col-90">
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        id="email"
                        required />
                </div>

                <div className="col-10">
                    <label for="address">Address</label>
                </div>
                <div className="col-90"> 
                    <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        id="address"/>
                </div>

                <button className="member-button" type="submit" id="submit">
                    Save
                </button>
            </form>
            <br></br>
            <button className="member-button" onClick={navToMember}>Back to Member</button>
        </div>
    );
} 

export default EditMember;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from "react-router-dom";

function EditMember() {

    const { id } = useParams();
    console.log("Member ID:", id);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getMember = async () => {
            try {
                const url = `/members/${id}`;
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

    const editMember = async () => {
        try {
            const url = `/members/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "name": name, "email": email, "address": address })
            });
            if (response.status === 200) {
                console.log("Member data updated successfully");
                navigate(url);
            } else {
                console.log("Error updating member data");
            }
        } catch (error) {
            console.log(error);
        }
    };


    return (
        <>
            <h2>Edit Member</h2>
            <form onSubmit={(e) => {e.preventDefault();}}>
                <fieldset>
                    <label for="name">Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        value={name} 
                        onChange={e => setName(e.target.value)}
                        id="name"/>
                    <label for="email">Email</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        id="email"/>
                    <label for="address">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        id="address"/>
                    <button
                        type="submit"
                        onClick={editMember}
                        id="submit">Save</button>
                </fieldset>
            </form>
        </>
    );
} 

export default EditMember;
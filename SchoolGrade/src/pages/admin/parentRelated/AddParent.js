import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../redux/userRelated/userHandle';
import Popup from '../../../components/Popup';
import { underControl } from '../../../redux/userRelated/userSlice';
import { CircularProgress } from '@mui/material'; 

const AddParent = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const userState = useSelector(state => state.user);
    const { status, currentUser, response, error } = userState;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    
    const adminID = currentUser._id;
    const role = "Parent";

    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");
    const [loader, setLoader] = useState(false);

    const fields = { name, email, password, contactNumber, adminID, role };

    const submitHandler = (event) => {
        event.preventDefault();
        if (!name || !email || !password || !contactNumber) {
            setMessage("Please fill in all fields");
            setShowPopup(true);
        } else {
            setLoader(true);
            dispatch(registerUser(fields, role));
        }
    };

    useEffect(() => {
        if (status === 'added') {
            dispatch(underControl());
            navigate(-1);
        } else if (status === 'failed') {
            setMessage(response);
            setShowPopup(true);
            setLoader(false);
        } else if (status === 'error') {
            setMessage("Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, navigate, error, response, dispatch]);

    return (
        <>
            <div className="register">
                <form className="registerForm" onSubmit={submitHandler}>
                    <span className="registerTitle">Add Parent</span>
                    <label>Name</label>
                    <input className="registerInput" type="text" placeholder="Enter parent's name..."
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        autoComplete="name" required />

                    <label>Email</label>
                    <input className="registerInput" type="email" placeholder="Enter parent's email..."
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        required />

                    <label>Contact Number</label>
                    <input className="registerInput" type="text" placeholder="Enter parent's contact number..."
                        value={contactNumber}
                        onChange={(event) => setContactNumber(event.target.value)}
                        required />

                    <label>Password</label>
                    <input className="registerInput" type="password" placeholder="Enter parent's password..."
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="new-password" required />

                    <button className="registerButton" type="submit" disabled={loader}>
                        {loader ? (
                            <CircularProgress size={24} color="inherit" />
                        ) : (
                            'Add'
                        )}
                    </button>
                </form>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
};

export default AddParent;

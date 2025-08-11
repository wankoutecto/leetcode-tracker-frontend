import '../App.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useAuth } from "../AuthContext"
import { isTokenValid } from './isTokenValid';


export default function AddNewProblem({onUpdate}){
    const {token, logout} = useAuth();
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [dateSolved, setDateSolved] = useState('');
    const [note, setNote] = useState('');
    const [solutionCode, setSolutionCode] = useState('');
    const [error, setError] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const popupRef = useRef(null); //give you the reference for the part of the screen you click

    const [response, setResponse] = useState();

    const addProblem = async(e) => {
        e.preventDefault();
        try{
            if(!token){
                alert("You are not login. Please login to add new problem");
                return;
            }
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/problem/add`,
                { title, link, dateSolved, note, solutionCode },
                {headers:{
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if(res.status === 200){
                setTitle('');
                setLink('');
                setDateSolved('');
                setNote('');
                setSolutionCode('');
                setResponse("New problem Added"); 
                setError("")
                onUpdate();
            }
        } catch (err) {
            if(!isTokenValid(token)){
                logout();
            }
            else if(err.status === 409){
                setError(err.response.data.message);
                setResponse('');
                setEdited('');
                return;
            }
            setError(err.message + ". Check date format: yyyy-mm-dd");
            console.error(err?.response?.data?.message || "Error Occurred");
            setResponse("");
        }
    };

    useEffect(() => {
        const handlePopUp = (e) => {
            if(popupRef.current && !popupRef.current.contains(e.target)){
                setShowPopup(false);
            }
        }

        if(showPopup){
            document.addEventListener("mousedown", handlePopUp);
        }
        return () => {
            document.removeEventListener("mousedown", handlePopUp);
        }
    }, [showPopup]);


    return (
        <div>
            <div className="add-problem-card">
                <p className="page-title">Add New Problem</p>
                <form onSubmit={addProblem}>
                    <label>
                        Title
                        <input
                        type="text"
                        value={title}
                        onChange={e => {
                            setTitle(e.target.value)
                            setResponse('')
                            setError('')
                        }}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Link
                        <input
                        type="text"
                        value={link}
                        onChange={e => setLink(e.target.value)}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Date solved
                        <input
                        type="text"
                        value={dateSolved}
                        onChange={e => setDateSolved(e.target.value)}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Note
                        <input
                        type="text"
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        required
                        ></input>
                    </label>
                    <br />
                    <label>
                        Solution Code
                        <input
                        type="text"
                        value={solutionCode}
                        onChange={(e) => setSolutionCode(edited)}    
                        onClick={() => setShowPopup(true)}
                        required
                        ></input>
                    </label>
                    <button type="submit">Add New Problem</button>
                    {response && <p>{response}</p>}
                    {error && <p>{error}</p>}
                </form>     
            </div>
            {showPopup && (
            <div className="popup-container">
                <div className="popup-box" ref={popupRef}>
                    <textarea 
                    placeholder='input solution code here'
                    className="editable" 
                    value={solutionCode}
                    onChange={(e) => setSolutionCode(e.target.value)}
                    />
                    <div className="button-group">                   
                        <div className="atCenter">    
                            <button onClick={() => setShowPopup(false)}>Close</button>
                         </div>
                    </div>
                </div>
            </div>)}
        </div>
    );
}
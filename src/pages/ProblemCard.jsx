import { useState } from "react";
import '../App.css';
import axios from "axios";
import { useAuth } from '../AuthContext';
import { isTokenValid } from './isTokenValid';

const FIELD = ['note', 'solutionCode'];


export default function ProblemCard({pb, onUpdate, activeTab}){
    const {token, logout} = useAuth();
    const [showPopup, setShowPopup] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedCode, setEditedCode] = useState("");
    const [fieldEdited, setFieldEdited] = useState('');
    const [error, setError] = useState('');


    const handleSave = async () => {
        if (editedCode.trim() !== '') {
            // Build updated problem data
            const updatedProblem = {
                title: pb.title,
                link: pb.link,
                dateSolved: pb.dateSolved,
                note: fieldEdited === FIELD[0] ? editedCode : pb.note,
                solutionCode: fieldEdited === FIELD[1] ? editedCode : pb.solutionCode,
                reviewLeft: pb.reviewLeft
            };

            try {
                const res = await axios.post(
                    "http://54.145.219.157:8080/problem/update",
                    updatedProblem, 
                    {headers: {Authorization: `Bearer ${token}`}}
                );

                if (res.status === 200) {
                    onUpdate(); // tell parent to refresh
                }
            } catch (err) {
                if(!isTokenValid(token)){
                    logout();
                }
                console.error("Update failed:", err);
            }
        }

        setIsEditing(false);
        setShowPopup(false);
    };

    const handleClose = () => {
        setIsEditing(false);
        setShowPopup(false);
    }


    const onMarkDone = async(title) => {
        try {
            const encodeTitle = encodeURIComponent(title);
            const res = await axios.post(`http://54.145.219.157:8080/problem/done/${encodeTitle}`,{}, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if(res.status === 200){
                onUpdate();
                console.log("Mark done");
            }
        } catch (err) {
            if(!isTokenValid(token)){
                logout();
            }
            console.error(err);
        }
    }

    const addToDueToday = async(title) => {
        try {
            const encodeTitle = encodeURIComponent(title);
            const res = await axios.post(`http://54.145.219.157:8080/problem/addToDueToday/${encodeTitle}`,{}, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if(res.status === 200){
                onUpdate();
                console.log("Add to due today");
            }
        } catch (err) {
            if(!isTokenValid(token)){
               logout();
            }else if(err.status === 409){
                setError(err.response.data.message);
                return;
            }
            console.error(err);
        }
    }

    const resetProblem = async(title) => {
        try {
            const encodeTitle = encodeURIComponent(title);
            const res = await axios.post(`http://54.145.219.157:8080/problem/reset/${encodeTitle}`,{}, {
                headers:{
                    Authorization: `Bearer ${token}`
                }
            });
            if(res.status === 200){
                onUpdate();
                console.log("Problem reset");
            }
        } catch (err) {
            if(!isTokenValid(token)){
               logout();
            }else if(err.status === 409){
                setError(err.response.data.message);
                return;
            }
            console.error(err);
        }
    }


    
    return (
        <>
            <div className= "review-card">
                <div className="review-card-toLink">
                    <a
                    href={pb.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline viewStyle"
                    >
                    view problem
                    </a>
                </div>

                <p className="page-title">{pb.title}</p>

                <div className="info-line">
                    <span>Note</span>
                    <button
                        onClick={() => {
                            setEditedCode(pb.note);
                            setShowPopup(true);
                            setFieldEdited(FIELD[0]);
                        }}
                        className="no-underline viewStyle"
                        >
                        Show
                    </button>
                </div>

                <div className="info-line">
                    <span>Solution Code</span>
                    <button
                        onClick={() => {
                            setEditedCode(pb.solutionCode);
                            setShowPopup(true);
                            setFieldEdited(FIELD[1]);
                        }}
                        className="no-underline viewStyle"
                        >
                        Show
                    </button>
                </div>

                <div className="info-line">
                    <span>Date Solved</span>
                    <span style={{ fontWeight: 700 }}>{pb.dateSolved}</span>
                </div>

                <div className="info-line">
                    <span>Review Left</span>
                    <span style={{ fontWeight: 700, color: "red" }}>{pb.reviewLeft}</span>
                </div>
                
            
                <br />
                <div className="review-card-bottom">
                    {activeTab === "Due Today" && (
                        <button onClick={() => onMarkDone(pb.title)} >Mark as Done</button>
                    )}
                    {(activeTab === "Future Review" || activeTab === "Overdue") && (
                        <button onClick={() => addToDueToday(pb.title)} >Add to Due Today</button> 
                        
                    )}
                    {(activeTab === "Fully Reviewed") && (
                        <button onClick={() => resetProblem(pb.title)}>Reset Review</button>   
                    )}
                </div>
                {error && <p>{error}</p>}
            </div>

            {showPopup && (
                <div className="popup-container">
                    <div className="popup-box">
                        {isEditing ? (
                            <textarea
                            value={editedCode}
                            onChange={(e) => setEditedCode(e.target.value)}
                            className="editable"
                            />
                        ) : (
                            <p className="editable">{editedCode}</p>
                        )}
                        <div className="button-group">
                            <div className="atCenter">
                            {isEditing ? (
                                <>
                                <button onClick={handleSave}>Save</button>
                                <button onClick={handleClose}>Close</button>
                                </>
                            ) : (
                                <>
                                <button onClick={() => setIsEditing(true)}>Edit</button>
                                <button onClick={handleClose}>Close</button>
                                </>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import ProblemCard from './ProblemCard';
import AddNewProblem from "./AddNewProblem";
import DueToday from "./DueToday";
import AllProblems from "./AllProblems";
import { useAuth } from "../AuthContext"
import FutureReview from "./FutureReview";
import { isTokenValid } from "./isTokenValid";
import Overdue from "./Overdue";
import FullyReview from "./FullyReview";
import {jwtDecode} from "jwt-decode";

export default function Dashboard({activeTab, update, onUpdate, onMoveToTab}){
    const {token, logout} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [problemList, setProblemList] = useState([]);
    const [pb, setPb] = useState('');
    const [dueToday, setDueToday] = useState(null);
    const [future, setFuture] = useState(null);
    const [overdue, setOverdue] = useState(null);
    const [fullyReviewed, setFullyReviewed] = useState(null);


    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const [dueRes, futureRes, overdueRes, fullyRes, problemList] = await Promise.all([
                    axios.get("http://54.145.219.157:8080/problem/due/today", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://54.145.219.157:8080/problem/upcoming", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://54.145.219.157:8080/problem/overdue", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://54.145.219.157:8080/problem/completed", {
                        headers: { Authorization: `Bearer ${token}` }
                    }),
                    axios.get("http://54.145.219.157:8080/problem/get/all", {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                ]);
                
                setDueToday(dueRes.data.data[0] || null);
                setFuture(futureRes.data.data[0] || null);
                setOverdue(overdueRes.data.data[0] || null);
                setFullyReviewed(fullyRes.data.data[0] || null);
                setProblemList(problemList.data.data || []);

                

            } catch (err) {
                if (!isTokenValid(token)) {
                    logout();
                }
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCategories();

    }, [activeTab, update, token, logout]);
    

    if(loading) return <p>The page is loading...</p>
    if(error) return <p>Failed to fetch the data: {error.message}</p>

    return (
        <div 
        className='grid-display' 
        style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
            <div onClick={() => onMoveToTab("Due Today")} className="dash-container">
                <h1>Due Today</h1>
                {dueToday ? (
                    <div style={{ pointerEvents: "none" }}>
                        <ProblemCard
                            pb={dueToday}
                            token={token}
                            onUpdate={onUpdate}
                            activeTab="Dashboard"
                        />
                    </div>
                ) : <p>No due problems</p>}
            </div>

            <div onClick={() => onMoveToTab("Future Review")} className="dash-container">
                <h1>Future Review</h1>
                {future ? (
                    <div style={{ pointerEvents: "none" }}>
                        <ProblemCard
                            pb={future}
                            token={token}
                            onUpdate={onUpdate}
                            activeTab="Dashboard"
                        />
                    </div>
                ) : <p>No future problems</p>}
            </div>

            <div onClick={() => onMoveToTab("Overdue")} className="dash-container">
                <h1>Overdue</h1>
                {overdue ? (
                    <div style={{ pointerEvents: "none" }}>
                        <ProblemCard
                            pb={overdue}
                            token={token}
                            onUpdate={onUpdate}
                            activeTab="Dashboard"
                        />
                    </div>
                ) : <p>No overdue problems</p>}
            </div>

            <div onClick={() => onMoveToTab("Fully Reviewed")} className="dash-container">
                <h1>Fully Reviewed</h1>
                {fullyReviewed ? (
                    <div style={{ pointerEvents: "none" }}>
                        <ProblemCard
                            pb={fullyReviewed}
                            token={token}
                            onUpdate={onUpdate}
                            activeTab="Dashboard"
                        />
                    </div>
                ) : <p>No fully reviewed problems</p>}
            </div>

            <div onClick={() => onMoveToTab("All problems")} className="dash-container">
                <h1>All Problems</h1>
                {problemList ?
                <table>
                
                    <tbody style={{pointerEvents: "none", backgroundColor:"white"}}>
                    {problemList.map((pb) => (
                        <tr key={pb.title}>
                            <td className='title'>{pb.title}</td>
                            <td>
                                <a href={pb.link} 
                                target='_blank' 
                                rel='noopener noreferrer'
                                className='delete'
                                >Link</a>
                            </td>
                            <td>{pb.dateSolved}</td> 
                            <td style={{color: pb.reviewLeft > 0 ? "red" : "inherit"}} >{pb.reviewLeft}</td>
                            <td onClick={() => setProblem(pb.title)} 
                            className='delete'>Delete</td>
                        </tr>
                    ))}
                    </tbody>
                </table>:
                <>No List of Problems</>}
            </div>
        
        </div>
    );
}
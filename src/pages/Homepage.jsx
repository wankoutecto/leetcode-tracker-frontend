import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../App.css';
import AddNewProblem from "./AddNewProblem";
import DueToday from "./DueToday";
import AllProblems from "./AllProblems";
import { useAuth } from "../AuthContext"
import FutureReview from "./FutureReview";
import { isTokenValid } from "./isTokenValid";
import Overdue from "./Overdue";
import FullyReview from "./FullyReview";
import Dashboard from "./Dashboard";



const TABS = ['Dashboard','Due Today', 'Future Review', 'Overdue', 'Fully Reviewed', 'All problems'];

export default function Homepage(){
  const { token, logout, username } = useAuth();
  const [problemList, setProblemList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const navigate = useNavigate();
  const [update, setUpdate] = useState(0);

  const onUpdate = () => {
    setUpdate(prev => prev + 1);
  };

  const onMoveToTab = (title) => {
    setActiveTab(title);
  };

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/problem/home`);
        setProblemList(res.data);
      } catch (err) {
        if(!isTokenValid(token)){
          logout();
        }
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeTab, token]);


  if(loading) return <p>The page is loading...</p>
  if(error) return <p>Failed to fetch the data: {error.message}</p>

  return (
      <>
        <div className="header">
          <h1>Leetcode Tracker</h1>
          <div className="button-group">
            {!token ? (
              <>
              <button onClick={() => navigate('/register')}>Sign up</button>
              <button onClick={() => navigate('/login')}>Log in</button>
              </>
            ) : (
              <>
              <p>{username}</p>
              <button onClick={logout}>Log out</button>
              </>
            )}  
          </div>
        </div>
        <div className="nav">
            {TABS.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(tab)}
                className={activeTab===tab? 'active': ''}
              >{tab}</button>
            ))}
        </div>     
        <div className="review-problem-container">
          <div className="review-container">
            {/*Always mount component using css using (display: block to show and display: none)*/}
            <div style={{ display: activeTab === TABS[0] ? 'block' : 'none' }}> 
              <Dashboard activeTab={activeTab} update={update} onUpdate={onUpdate} onMoveToTab={onMoveToTab} />
            </div>

            <div style={{ display: activeTab === TABS[1] ? 'block' : 'none' }}> 
              <DueToday activeTab={activeTab} update={update} onUpdate={onUpdate} />
            </div>

            <div style={{ display: activeTab === TABS[2] ? 'block' : 'none' }}> 
              <FutureReview activeTab={activeTab} update={update} onUpdate={onUpdate} />
            </div>

            <div style={{ display: activeTab === TABS[3] ? 'block' : 'none' }}> 
              <Overdue activeTab={activeTab} update={update} onUpdate={onUpdate} />
            </div>

             <div style={{ display: activeTab === TABS[4] ? 'block' : 'none' }}> 
              <FullyReview activeTab={activeTab} update={update} onUpdate={onUpdate} />
            </div>

            <div style={{ display: activeTab === TABS[5] ? 'block' : 'none' }}> 
              <AllProblems activeTab={activeTab} update={update} onUpdate={onUpdate}/>
            </div>

          </div >

          <div className="add-problem-container">
            <AddNewProblem onUpdate={onUpdate} />
          </div>

        </div>
    </>
  );
}

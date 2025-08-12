import { useEffect, useState } from 'react';
import '../App.css'
import axios from 'axios';
import ProblemCard from './ProblemCard';
import { useAuth } from '../AuthContext';
import { isTokenValid } from './isTokenValid';

export default function FutureReview({activeTab, update, onUpdate}){
    const {token, logout} = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [problemList, setProblemList] = useState([]);
    

    useEffect(() => {
        const fetchProblem = async() => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/problem/upcoming`, {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                })
                if(res.status === 200){
                    setProblemList(res.data.data);
                }     
            }catch (err) {
                if(!isTokenValid(token)){
                    logout();
                }
                setError(err);
            }finally{
                setLoading(false);
            }
        };
        
        fetchProblem(); 
    }, [activeTab, update, token, logout]);
    

    if(loading) return <p>The page is loading...</p>
    if(error) return <p>Failed to fetch the data: {error.message}</p>

    
    return (
        <>
        {problemList.length !== 0 ? 
        <div className='grid-display'>
            {problemList.map((pb, idx) => (
                <ProblemCard 
                    key={pb.id || idx} 
                    pb={pb}
                    token={token}
                    onUpdate={onUpdate}
                    activeTab={activeTab}  
                />
            ))}
        </div> :
        <p>NO Future Review Problems</p>
        }
        </>
    );

}
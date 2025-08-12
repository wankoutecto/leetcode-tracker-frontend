import { useEffect, useState } from 'react';
import '../App.css'
import axios from 'axios';
import { useAuth } from "../AuthContext"
import { isTokenValid } from './isTokenValid';


export default function AllProblems({activeTab, update, onUpdate}){
    const {token, logout} = useAuth();
    const [problemList, setProblemList] = useState([]);
    const [searchProblem, setSearchProblem] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const allProblem = async() => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/problem/get/all`, {
                    headers:{
                        Authorization: `Bearer ${token}`
                    }
                });
                setProblemList(res.data.data);
            } catch (err) {
                if(err.status === 403 || err.status === 401){
                    logout();
                }
                console.error(err);
            }
        };

        if(activeTab === "All problems"){
            allProblem();
        }
    }, [activeTab, update, token, logout]);

    const handleInput = (e) => {
        setSearchProblem(e.target.value.toLowerCase());
    };

    const filterProblem = problemList.filter(pb => 
        pb.title.toLowerCase().includes(searchProblem) ||
        pb.dateSolved.toLowerCase().includes(searchProblem)
    );

    const setProblem = (t) => {
        setIsDeleting(true);
        setTitle(t);
    };

    const deleteProblem = async() => {
        try {
            const encodeTitle = encodeURIComponent(title);
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/problem/delete/${encodeTitle}`,
                {headers:{Authorization: `Bearer ${token}`}}
            )
            if(res.status === 200){
                onUpdate();
            }     
        } catch (err) {
            if(!isTokenValid(token)){
                logout();
            }else if(err.status === 409){
                setError(err.response.data.message);
                return;
            }
            console.error(err);
        }finally{
            setIsDeleting(false);
        }
    };
        


    return (
       <div >
        <h1>All Problems</h1>
        <form className='search-problem' onSubmit={e => e.preventDefault()}>
            <button>🔍</button>
            <input 
            placeholder='Search Problem By Title'
            value={searchProblem}
            onChange={handleInput}
            ></input>
            
        </form>
        <table>
            <thead>
               <tr className='title'>
                <th>Title</th>
                <th>Link To LeetCode</th>
                <th >Date Solved</th>
                <th>Review Left</th>
                <th></th>
               </tr> 
            </thead>
            <tbody>
                {filterProblem.map((pb) => (
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
        </table>
        {isDeleting ? 
            <div className='popup-container' >
                <div className='delete-box'>
                    <p>{title}</p>
                    <button onClick={deleteProblem}>Delete</button>
                    <button onClick={() => setIsDeleting(false)} >Cancel</button>
                </div>
            </div> : null
        }
       </div> 
    );
}
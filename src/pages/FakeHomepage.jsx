import { useEffect, useState } from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
import AddNewProblem from "./AddNewProblem";
import axios from "axios";

const TABS = ['Dashboard','Due Today', 'Future Review', 'Overdue', 'Fully Reviewed', 'All problems'];


function FakeProblemCard({activeTab, pb}){
    if (!pb) return null;
    return (
        <>
            <div className= "review-card">
                <div className="review-card-toLink">
                    <a
                    href="put link here"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline viewStyle"
                    >
                    view problem
                    </a>
                </div>

                <p className="page-title">{pb.title}</p>

                <div className="info-line" style={{ pointerEvents: "none"}}>
                    <span>Note</span>
                    <button
                        className="no-underline viewStyle"
                        >
                        Show
                    </button>
                </div>

                <div className="info-line" style={{ pointerEvents: "none"}}>
                    <span>Solution Code</span>
                    <button
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
                <div className="review-card-bottom" style={{ pointerEvents: "none"}}>
                    {activeTab === "Due Today" && (
                        <button>Mark as Done</button>
                    )}
                    {(activeTab === "Future Review" || activeTab === "Overdue") && (
                        <button>Add to Due Today</button> 
                        
                    )}
                    {(activeTab === "Fully Reviewed") && (
                        <button>Reset Review</button>   
                    )}
                </div>
            </div>
        </>
    );
}


function FakeView({activeTab, today}){
    return (
        <div className={activeTab!== "Dashboard" ? 'grid-display' : ''}>
            {today.map((pb, idx) => (
                <FakeProblemCard key={idx} activeTab={activeTab} pb={pb} />
            ))}
        </div>            
    );
}

function FakeAll({all}){
    if(!all) return <p>No list of Problem</p>
    return (
        
        <table>
            <tbody>
                {all.map((pb) => (
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
                        <td className='delete'>Delete</td>
                    </tr>
                ))}
            </tbody>
        </table>        
    );
}

function FakeDashboard({activeTab, today, future, overdue, fully, all, onMoveToTab}){
    return (
            <div 
            className='grid-display' 
            style={{gridTemplateColumns: "repeat(3, 1fr)"}}>
                <div onClick={() => onMoveToTab("Due Today")} className="dash-container">
                    <h1>Due Today</h1>
                    <div style={{ pointerEvents: "none"}}>
                       <FakeView activeTab={activeTab} today={[today[0]]} /> 
                    </div>
                </div>
    
                <div onClick={() => onMoveToTab("Future Review")} className="dash-container">
                    <h1>Future Review</h1>
                        <div style={{ pointerEvents: "none" }}>
                           <FakeView activeTab={activeTab} today={future} /> 
                        </div>
                </div>
    
                <div onClick={() => onMoveToTab("Overdue")} className="dash-container">
                    <h1>Overdue</h1>
                        <div style={{ pointerEvents: "none" }}>
                            <FakeView activeTab={activeTab} today={overdue} />
                        </div>
                </div>
    
                <div onClick={() => onMoveToTab("Fully Reviewed")} className="dash-container">
                    <h1>Fully Reviewed</h1>
                        <div style={{ pointerEvents: "none" }}>
                            <FakeView activeTab={activeTab} today={fully} />
                        </div>
                </div>
    
                <div onClick={() => onMoveToTab("All problems")} className="dash-container">
                    <h1>All Problems</h1>
                    <div>
                        <FakeAll all={all} />    
                    </div>
                </div>
            
            </div>
        );
}


export default function FakeHomepage(){
    const [activeTab, setActiveTab] = useState('Dashboard');
    const navigate = useNavigate();
    const [today, setToday] = useState([]);
    const [future, setFuture] = useState([]);
    const [overdue, setOverdue] = useState([]);
    const [fully, setFully] = useState([]);
    const [all, setAll] = useState([]);

    const onMoveToTab = (title) => {
    setActiveTab(title);
  }

    useEffect(() => {
        const problemList = [
            {
                title: "Two Sum",
                link: "https://leetcode.com/problems/two-sum/",
                dateSolved: "2025-07-12",
                note: "Used hashmap for O(n) solution.",
                solutionCode: "function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n}",
                reviewLeft: "2"
            },
            {
                title: "Valid Parentheses",
                link: "https://leetcode.com/problems/valid-parentheses/",
                dateSolved: "2025-07-14",
                note: "Used stack to track open brackets.",
                solutionCode: "function isValid(s) {\n  const stack = [];\n  const map = { ')':'(', ']':'[', '}':'{' };\n  for (let char of s) {\n    if (['(', '[', '{'].includes(char)) {\n      stack.push(char);\n    } else if (stack.pop() !== map[char]) {\n      return false;\n    }\n  }\n  return stack.length === 0;\n}",
                reviewLeft: "0"
            },
            {
                title: "Merge Two Sorted Lists",
                link: "https://leetcode.com/problems/merge-two-sorted-lists/",
                dateSolved: "2025-07-15",
                note: "Recursive merge solution.",
                solutionCode: "function mergeTwoLists(l1, l2) {\n  if (!l1) return l2;\n  if (!l2) return l1;\n  if (l1.val < l2.val) {\n    l1.next = mergeTwoLists(l1.next, l2);\n    return l1;\n  } else {\n    l2.next = mergeTwoLists(l1, l2.next);\n    return l2;\n  }\n}",
                reviewLeft: "4"
            },
            {
                title: "Best Time to Buy and Sell Stock",
                link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",
                dateSolved: "2025-07-17",
                note: "Tracked minimum price and max profit.",
                solutionCode: "function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (let price of prices) {\n    minPrice = Math.min(minPrice, price);\n    maxProfit = Math.max(maxProfit, price - minPrice);\n  }\n  return maxProfit;\n}",
                reviewLeft: "1"
            },
            {
                title: "Climbing Stairs",
                link: "https://leetcode.com/problems/climbing-stairs/",
                dateSolved: "2025-07-18",
                note: "Classic DP – Fibonacci pattern.",
                solutionCode: "function climbStairs(n) {\n  if (n <= 2) return n;\n  let a = 1, b = 2;\n  for (let i = 3; i <= n; i++) {\n    [a, b] = [b, a + b];\n  }\n  return b;\n}",
                reviewLeft: "3"
            }
        ];

        setToday([problemList[0], problemList[3]]);
        setFuture([problemList[4]]);
        setFully([problemList[1]]);
        setOverdue([problemList[2]]);
        setAll(problemList);
    }, []);

    return (
        <div>
            <div className="header">
                <h1>Leetcode Tracker</h1>
                <div className="button-group">
                    <button onClick={() => navigate('/register')}>Sign up</button>
                    <button onClick={() => navigate('/login')}>Log in</button>
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
                    {activeTab === 'Dashboard' && 
                        <FakeDashboard 
                        activeTab={activeTab} 
                        today={today} 
                        future={future} 
                        overdue={overdue} 
                        fully={fully}
                        all={all}
                        onMoveToTab={onMoveToTab} />    
                    }
                    {activeTab === 'Due Today' && 
                        <FakeView activeTab={activeTab} today={today} />   
                    }
                    {activeTab === 'Future Review' && 
                        <FakeView activeTab={activeTab} today={future} />   
                    }  
                    {activeTab === 'Overdue' && 
                        <FakeView activeTab={activeTab} today={overdue} />   
                    }  
                    {activeTab === 'Fully Reviewed' && 
                        <FakeView activeTab={activeTab} today={fully} />  
                    }    
                    {activeTab === 'All problems' && 
                        <FakeAll all={all} />  
                    }        
                </div >
            
                <div className="add-problem-container">
                    <AddNewProblem />
                </div>
            </div>
        </div>
    );
}


 
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../AuthContext";


export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {login} = useAuth();    
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, {
                username,
                password
            });
            console.log("API URL:", process.env.REACT_APP_API_URL);

            login(res.data.token, username);
            navigate('/');
        } catch (error) {
            setError("Invalid username or password");
        }
    };
    return (
        <div className="form-card-container">
            <form onSubmit={handleSubmit} className="form-card">
                <h2>Log in</h2>
                <label>
                    Username
                    <br />
                    <input 
                    type="text" 
                    value={username} 
                    onChange={e => {
                        setUsername(e.target.value);
                        setError('');
                    }}
                    required
                    placeholder="Enter username"
                    />
                </label>

                <br />

                <label>
                    Password
                    <br />
                    <input
                    type="password"
                    value={password}
                    onChange={e => {
                        setPassword(e.target.value);
                        setError('');
                    }}
                    required
                    placeholder="Password"
                    />
                </label>
                <br />
                {error ? <p className="error">{error}</p> : null}
                <button type="submit">Log in</button>
                <br />
                <p>
                    Don't have an account? 
                    <Link to={"/register"} className="no-underline"> Sign up</Link>
                    <br />
                    <br />
                    <Link to={'/'} className="no-underline"> Return home page</Link>
                </p>
            </form>
        </div>
    );
};




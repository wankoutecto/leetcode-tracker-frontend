import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword){
        setError("Passwords do not match. please rentered password");
        setSuccess('');
        return;
    }
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/register`,{
        username,
        password
      });
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      if(res.status === 200){
        setSuccess("Successful register");
        setError('');
        navigate('/');
        return;
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Sorry did not go through. Please try again");
      }else if (error.response && error.response.status === 409){
        setError("Sorry username already exists");
      }else{
        setError("An Unexpected error occurred");
      }
      setSuccess(null);
    }
  }
  return (
    <div className="form-card-container" >
        
        <form  className="form-card" onSubmit={handleSubmit}>
          <h2>Sign Up</h2>
            <label>
                Username
                <br /> 
                <input
                type="text"
                value={username}
                onChange={e => {
                  setUsername(e.target.value);
                  setError('');
                  setSuccess('');
                }} 
                required
                ></input>
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
                  setSuccess('');
                }}
                required
                />
            </label>
             <br />
            <label>
                Confirm Password
                <br />
                <input
                type="password"
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setError('');
                  setSuccess('');
                }}
                required
                />
            </label>
            
            <button type="submit">Sign up</button>
            {error ? <p className="error">{error}</p>: null}
            {success ? <p className="success">{success}</p> : null}
            <p>
              Already have an account? 
              <Link to={'/login'} className="no-underline"> Log in</Link>
              <br />
              <br />
              <Link to={'/'} className="no-underline"> Return home page</Link>  
            </p>
            
        </form>

    </div>
  );
}
export default Register;
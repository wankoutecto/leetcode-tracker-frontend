import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState(localStorage.getItem("username"));

    useEffect(() => {
        if(token){
            try {
                const {exp} = jwtDecode(token);
                if(Date.now() >= exp * 1000){
                    logout();
                }
            } catch (error) {
                logout();
            }
        }
    }, [token])

    const login = (newToken, newUsername) => {
        localStorage.setItem("token", newToken);
        localStorage.setItem("username", newUsername);
        setToken(newToken);
        setUsername(newUsername);
    }

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        setToken(null);
        setUsername(null);
        navigate("/");
    };

    return (
        <AuthContext.Provider value={{token, username, login, logout}} >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
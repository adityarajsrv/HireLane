import api from "../lib/axios.js";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null)

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try{
                const res = await api.get("/auth/me");
                setUser(res.data.user);
            }catch{
                setUser(null);
            }finally{
                setLoading(false);
            }
        }
        checkAuth();
    }, [])

    const register = async (name, email, password) => {
        const res = await api.post("/auth/register", { name, email, password });
        setUser(res.data.user);
        return res.data;
    }

    const login = async (email, password) => {
        const res = await api.post("/auth/login", { email, password });
        setUser(res.data.user);
        return res.data;
    }

    const logout = async () => {
        try{
            await api.post("/auth/logout");
        }catch{ 
            /* empty */
         }finally{
            setUser(null);
        }
    }

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        register,
        login,
        logout,
        setUser
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { AuthProvider, useAuth };
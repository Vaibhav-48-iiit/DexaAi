import { useState,useEffect } from "react";
import { createContext,  } from "react";
import {getMe} from "./services/auth.api"


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)    

    useEffect(() => {
        const checkauth = async () =>{
            try{
                const userData = await getMe();
                setuser(userData);
            } catch(error) {
             setuser(null);
             console.log("User not found",error)


            } finally {
                setloading(false)
            }
        }
        checkauth()
    },[]) //empty array means run on page reload



    return (
        <AuthContext.Provider value={{ user, setuser, loading, setloading }}>
            {children}
        </AuthContext.Provider>
    );
    
}
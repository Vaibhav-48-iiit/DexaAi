import { useState } from "react";
import { createContext,  } from "react";


// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(false)    



    return (
        <AuthContext.Provider value={{ user, setuser, loading, setloading }}>
            {children}
        </AuthContext.Provider>
    );
    
}
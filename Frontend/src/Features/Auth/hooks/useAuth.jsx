import {useContext} from "react";
import { AuthContext } from "../auth.context";
import { loginUser,registerUser,logoutUser,getMe } from "../services/auth.api";


export const Authuse = () => {
    const context = useContext(AuthContext);
    

    const { user, setuser, loading, setloading } = context;

    const handlelogin = async ({email,password}) => {
        setloading(true);
        try{
            const response = await loginUser({email,password});
            setuser(response.user);
            setloading(false);
           
            return response;
        }catch(error){
            setloading(false);
            throw error;
        }
    }

    const handleRegister = async({email,password,username}) => {
        setloading(true);
        try {
            const response = await registerUser({email,password,username});
            setuser(response.user);
            setloading(false);
            return response;
        } catch (error) {
            setloading(false);
            throw error;
        }
    }

    const handleLogout = async() => {
        setloading(true);
        try {
            const response = await logoutUser();
            setuser(null);
            setloading(false);
            return response;
        } catch (error) {
            setloading(false);
            throw error;
        }
    }

    const handleGetMe = async() => {
        setloading(true);
        try {
            const response = await getMe();
            setuser(response);
            setloading(false);
            return response;
        } catch (error) {
            setloading(false);
            throw error;
        }
    }

    return {
        user,
        loading,
        handlelogin,
        handleRegister,
        handleLogout,
        handleGetMe
    }

}
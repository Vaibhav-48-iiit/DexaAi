import {Authuse} from '../Auth/hooks/useAuth.jsx'
import { Navigate } from 'react-router'

export const Protected = ({children}) => {
    const { user, loading } = Authuse();

    if(loading){
        return <div>Loading...</div>
    }
    if(!user){
        return <Navigate to="/login" />
    }
    return children;
}
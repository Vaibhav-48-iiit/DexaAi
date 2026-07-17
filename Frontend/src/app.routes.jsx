import {createBrowserRouter} from "react-router";
import Login from "./Features/pages/login";
import Register from "./Features/pages/register";
import Dashboard from "./Features/pages/Dashboard";
import {Protected} from "./Features/components/protected.jsx"


export const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/register',
        element: <Register />
    },
    {
        path: '/',
        element: <Protected><Dashboard /></Protected>
    }
])

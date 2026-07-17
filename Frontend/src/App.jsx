import { RouterProvider } from "react-router" 
import { router } from "./app.routes.jsx";  
import { AuthProvider } from "./Features/Auth/auth.context";

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
  
}

export default App
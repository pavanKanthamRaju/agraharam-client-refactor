import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";
const ProtectedRoute = ({children})=>{
    const {user, setRedirectPath, loading} = useAuth();
    const location = useLocation();
    // return user ? children : <Navigate to="/login" replace />
    
    if (loading) return <div>Loading...</div>;

    if(!user){
       
        setRedirectPath(location.pathname);
        
        
        return <Navigate to="/login" replace />;
    }
    return children
}
export default ProtectedRoute
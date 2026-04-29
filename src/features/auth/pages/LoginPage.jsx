import React from "react";
import SigninForm from "../components/SigninForm"
import { login } from "../authApi";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../../context/authContext";
const LoginPage = () => {
    const { loginUser, setRedirectPath } = useAuth();
    const navigate = useNavigate();
    // const [isLopggedIn, setLoggedIn] =useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const credentials = {
            identifier: formData.get("identifier"),
            password: formData.get("password")
        };
        try {
            const userData = await login(credentials)
            console.log("LoginSiuccessfull", userData)
            if (!userData) {
                // setLoggedIn(false)
            } else {
                // setLoggedIn(true)
                localStorage.setItem("user", JSON.stringify(userData));
                loginUser(userData)
                // Redirect based on role
                debugger
                if (userData.user.isadmin) {
                    navigate("/admin/orders", { replace: true });
                } else {
                    navigate("/dashboard", { replace: true });
                }

                setRedirectPath(null);
            }
        } catch (err) {
            console.error("Login failed:", err.message);
        }
    }
    return (


        <SigninForm onSubmit={handleSubmit} />


    )
}
export default LoginPage
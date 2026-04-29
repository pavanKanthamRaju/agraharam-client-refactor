import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../../context/authContext";
import googleIcon from '../../../assets/google-icon.png'


const SigninForm = ({ onSubmit }) => {
  const base_path = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { loginUser, redirectPath, setRedirectPath } = useAuth();
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${response.access_token}`,
          },
        });
        console.log("userData " + res.data)
        debugger
        const user = await axios.post(
          `${base_path}/api/auth/google-login`,
          { userInfo: res.data }
        );

        console.log("✅ Google user data:", user.data);
        loginUser(user.data);
        navigate(redirectPath || "/dashboard", { replace: true });
        setRedirectPath(null);
        // setUser(res.data);
      } catch (err) {
        console.error("❌ Error fetching user info:", err);
      }
    },
    onError: (err) => console.error("❌ Login Failed:", err),
  });
  return (
    <div className="w-full max-w-sm">
      {/* <img src={agraharam_text_img} /> */}
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">Sign in</h1>
      <form onSubmit={onSubmit} className="flex flex-col space-y-4 x-4">
        <input
          name="identifier"
          placeholder="Email or Phone"
          required
          className="border rounded px-5 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="border rounded px-5 py-2"
        />

        <div className="flex justify-end w-full">
          <Link to="/signup" className="text-orange-600 hover:underline">
            Sign  up
          </Link>
        </div>
        <button
          type="submit"
          className="bg-orange-600 hover:bg-orange-700  text-white rounded py-2"
        >
          Login
        </button>
        <button
          onClick={() => loginWithGoogle()}
          className="flex items-center justify-center gap-2 border bg-black rounded-md bg-black py-2 px-4 hover:bg-gray-700 transition-colors"
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5" />
          <span className="text-gray-700 font-medium text-white">Login with Google</span>
        </button>
      </form>
    </div>
  );
};

export default SigninForm;

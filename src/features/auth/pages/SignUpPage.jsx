import React from "react";
import SignupForm from "../components/SignupForm";
import { useNavigate } from "react-router-dom";
import {signup} from "../authApi"

const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const data = {
      name: form.get("name"),
      email: form.get("email"),
      phone: form.get("phone"),
      password: form.get("password"),
      role: "user",
    };

    try {
      await signup(data);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  };

  return (
    // <div className="min-h-screen flex items-center justify-center p-8">
    // <div className="flex w-full md:w-1/3 items-center justify-center p-8">
    //     <h1 className="text-2xl font-bold mb-6 text-violet-700 text-center">Sign Up</h1>
    //     <SignupForm onSubmit={handleSubmit} />
    //   </div>
      <>
      <SignupForm onSubmit={handleSubmit} />
      </>
    // </div>
  );
};

export default SignUpPage;

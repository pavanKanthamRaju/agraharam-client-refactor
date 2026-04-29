import React from "react";
import logo from "../assets/logo.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* Left Section: Logo / Background Image */}
      <div className="w-full md:w-2/3 h-64 md:h-screen relative overflow-hidden">
        <img
          src={logo}
          alt="Logo"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Section: Content */}
      <div className="w-full md:w-1/3 h-64 md:h-screen flex items-center justify-center p-6 mt-5 md:mt-0">
        {children}
      </div>

    </div>
  );
};

export default AuthLayout;

import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { FaUserCircle } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import mainLogo from "../assets/main-logo.png";
import agraharamTextImg from "../assets/agraharam_text_img.png";

const DashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const logoNavigation = user ? (user.user.isadmin ? "/admin/orders" : "/dashboard") : "";

  const handleLogout = () => {
    localStorage.removeItem("user");
    logoutUser();
    navigate("/login", { replace: true });
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <>
      <header className="w-full bg-gradient-to-r from-yellow-300 to-red-300 shadow-md px-4 py-1 flex items-center justify-between fixed top-0 z-50 h-[89px]">
        
        {/* --- LEFT: Logo --- */}
        <div className="flex-shrink-0">
          <Link to={logoNavigation}>
            <img src={mainLogo} alt="Logo" className="h-16 md:h-20 w-auto" />
          </Link>
        </div>

        {/* --- CENTER: Agraharam Text (Strictly Centered) --- */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src={agraharamTextImg}
            alt="Agraharam"
            className="h-16 md:h-20 hidden sm:block"
          />
        </div>

        {/* --- RIGHT: Profile Dropdown or Sign In --- */}
        {!user ? (
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-orange-700 font-medium hover:underline">
              Sign In
            </Link>
            <button
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md transition"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            {/* Profile Dropdown */}
            <div className="relative flex-shrink-0" ref={dropdownRef}>
              <div
                className="flex items-center space-x-2 text-orange-700 font-medium cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {user.user.profile_image ? (
                  <img
                    src={user.user.profile_image}
                    alt="Profile"
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <FaUserCircle className="text-2xl" />
                )}
                <span className="text-[#a20e05] hidden xs:inline">{user.user.name || "User"}</span>
              </div>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-red-500 shadow-lg border rounded-md z-20">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-start gap-2 px-4 py-2 text-sm text-white hover:bg-red-600"
                  >
                    <FiLogOut className="text-base align-middle" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* --- SUB-HEADER: Navigation Tabs (Only for Customers) --- */}
      {user && user.user.isadmin !== true && (
        <div className="fixed top-[89px] left-0 right-0 h-[50px] z-40 bg-[#fffaf0]/80 backdrop-blur-md border-b border-orange-100/50 flex justify-center items-center px-4">
          <div className="flex bg-white/90 border border-orange-100/40 p-1 rounded-full shadow-sm max-w-lg w-full justify-between items-center">
            <Link
              to="/dashboard"
              className={`text-xs md:text-sm px-3 md:px-5 py-1.5 rounded-full transition-all duration-300 font-semibold text-center flex-1 ${
                location.pathname === "/dashboard"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-105"
                  : "text-orange-950 hover:text-orange-600 hover:bg-orange-50/50"
              }`}
            >
              Dashboard
            </Link>

            <Link
              to="/buy-items"
              className={`text-xs md:text-sm px-3 md:px-5 py-1.5 rounded-full transition-all duration-300 font-semibold text-center flex-1 ${
                location.pathname === "/buy-items"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-105"
                  : "text-orange-950 hover:text-orange-600 hover:bg-orange-50/50"
              }`}
            >
              Buy Items
            </Link>

            <Link
              to="/buy-nivedyam"
              className={`text-xs md:text-sm px-3 md:px-5 py-1.5 rounded-full transition-all duration-300 font-semibold text-center flex-1 ${
                location.pathname === "/buy-nivedyam"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-105"
                  : "text-orange-950 hover:text-orange-600 hover:bg-orange-50/50"
              }`}
            >
              Buy Nivedyam
            </Link>

            <Link
              to="/orders"
              className={`text-xs md:text-sm px-3 md:px-5 py-1.5 rounded-full transition-all duration-300 font-semibold text-center flex-1 ${
                location.pathname === "/orders"
                  ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md transform scale-105"
                  : "text-orange-950 hover:text-orange-600 hover:bg-orange-50/50"
              }`}
            >
              Orders
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardHeader;



import React, { useState } from "react";
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";

import DashboardHeader from "../components/DashboardHeader";
import DashboardFooter from "../components/DasboardFooter";
import Poojas from "../pages/admin/Poojas";
import ItemsPaage from "../pages/admin/ItemsPaage";
import OrdersPage from "../pages/admin/OrdersPage";
import AnnouncementsPage from "../pages/admin/AnnouncementsPage"
import { Menu } from "lucide-react";

// Helper component for Navigation Links
const NavLink = ({ to, children, setSidebarOpen }) => {
  const location = useLocation();
  // Check if active: 
  // 1. simple includes check
  // 2. Special case for 'Orders' which is the default redirect from '/admin'
  const isActive =
    location.pathname.includes(to) ||
    (to === "/admin/orders" && (location.pathname === "/admin" || location.pathname === "/admin/"));

  return (
    <Link
      to={to}
      className={`px-3 py-2 rounded font-medium transition-colors duration-200 
        ${isActive
          ? "bg-blue-50 text-blue-600 shadow-sm"
          : "text-white hover:bg-blue-50 hover:text-blue-600"
        }`}
      onClick={() => setSidebarOpen(false)}
    >
      {children}
    </Link>
  );
};

const AdminMainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <DashboardHeader />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile menu button */}
        {!sidebarOpen ?
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="absolute ml-4 mt-4 z-50 md:hidden p-2 bg-white shadow rounded-md border hover:bg-gray-50"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button> : ""
        }

        {/* Sidebar */}
        <aside
          className={`fixed md:static z-40 bg-gray-400 border-r border-gray-200 h-[calc(100vh-75px)] w-64 p-0 pt-[89px] pb-[65px] transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="flex justify-between items-center mb-6 md:hidden">
            <h2 className="text-lg font-semibold text-red-100">Admin Menu</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-600 text-2xl leading-none"
            >
              &times;
            </button>
          </div>

          <nav className="flex flex-col gap-3 h-full">
            <NavLink to="/admin/orders" setSidebarOpen={setSidebarOpen}>
              OrdersPage
            </NavLink>
            <NavLink to="/admin/poojas" setSidebarOpen={setSidebarOpen}>
              Poojas
            </NavLink>
            <NavLink to="/admin/items" setSidebarOpen={setSidebarOpen}>
              Items
            </NavLink>
            <NavLink to="/admin/announcements" setSidebarOpen={setSidebarOpen}>
              Announcements
            </NavLink>
          </nav>
        </aside>

        {/* Main panel */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50 md:h-[calc(100vh-120px)] pt-[89px] pb-[65px]">
          <Routes>
            <Route path="" element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="poojas" element={<Poojas />} />
            <Route path="items" element={<ItemsPaage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />



            PoojaItems
            <Route path="*" element={<Navigate to="orders" replace />} />
          </Routes>
        </main>
      </div>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default AdminMainLayout;

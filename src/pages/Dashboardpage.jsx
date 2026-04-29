import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPoojas, getAnnouncements } from "../api/dashboardsApi";
import { motion } from "framer-motion";

const Spinner = () => (
  <div className="flex justify-center items-center h-screen bg-white">
    <motion.div
      className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"
      initial={{ rotate: 0 }}
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1 }}
    />
  </div>
);

const PoojaCard = ({ pooja }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#fff7ed] border border-orange-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition flex flex-col h-full">
      <div className="relative">
        <img
          src={pooja.image_url}
          alt={pooja.name}
          className="w-full h-full object-cover max-h-[200px] object-top"
        />
        <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
          ₹{pooja.base_price}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{pooja.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2 min-h-[40px]">{pooja.description}</p>
        <div className="flex items-center text-orange-600 mt-3 text-sm">
          <svg
            className="w-4 h-4 mr-1 text-orange-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 9H9V5h2v6z" />
          </svg>
          {pooja.duration}
        </div>
        <button
          className="mt-auto w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          onClick={() => navigate(`/pooja/${pooja.id}`)}
        >
          Book Pooja
        </button>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [poojas, setPoojas] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  // Separate local loading control
  const [poojaLoading, setPoojaLoading] = useState(true);
  const [announcementLoading, setAnnouncementLoading] = useState(true);

  useEffect(() => {
    const fetchPoojas = async () => {
      try {
        const data = await getPoojas();
        setPoojas(data);
      } catch (error) {
        console.error("Error fetching poojas:", error);
      } finally {
        setPoojaLoading(false);
      }
    };

    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      } finally {
        setAnnouncementLoading(false);
      }
    };

    fetchPoojas();
    fetchAnnouncements();
  }, []);

  // Combined loading state
  useEffect(() => {
    if (!poojaLoading && !announcementLoading) {
      setLoading(false);
    }
  }, [poojaLoading, announcementLoading]);

  if (loading) return <Spinner />;

  // Separate announcement types
  const bannerAnnouncement = announcements.find(a => a.name === "Scrolling Banner");
  const popupAnnouncementHeaderText = announcements.find(a => a.name === "Header text");
  const popupAnnouncementHeading = announcements.find(a => a.name === "Header Heading ");
  const popupAnnouncementSubHeading = announcements.find(a => a.name === "Header Sub Heading");
  debugger

  return (
    <>
      {/* 🔸 Scrolling Banner */}
      {bannerAnnouncement && (
        <div className="mt-2 text-orange-800 overflow-hidden whitespace-nowrap relative">
          <style>
            {`
          @keyframes marquee {
            0% {
              transform: translateX(100%);
            }
            100% {
              transform: translateX(-100%);
            }
          }
          .animate-marquee-slow {
            display: inline-block;
            white-space: nowrap;
            animation: marquee 30s linear infinite; /* adjust speed here */
          }
          .animate-marquee-slow:hover {
            animation-play-state: paused; /* optional: pause on hover */
          }
        `}
          </style>
          <div className="animate-marquee-slow { inline-block">
            {bannerAnnouncement.description}
          </div>
        </div>
      )}

      {/* 🔸 Popup/Header Notice */}
      {popupAnnouncementHeaderText && (
        <motion.div
          className="max-w-4xl mx-auto mt-5 text-center mb-10 border bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 rounded-lg text-sm font-medium shadow-sm p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >


          <h2 className="text-2xl font-bold text-white mb-2"> {popupAnnouncementHeaderText.description}</h2> <p className="text-white text-sm"> {popupAnnouncementHeading.description} <br /> {popupAnnouncementSubHeading.description} </p>
        </motion.div>
      )}

      {/* 🔸 Pooja Cards Grid */}
      <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {poojas.map((pooja) => (
          <PoojaCard key={pooja.id} pooja={pooja} />
        ))}
      </div>
    </>
  );
};

export default DashboardPage;

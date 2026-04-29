// import React, { useEffect, useState } from "react";
// import {
//   getAnnouncements,
//   createAnnouncement,
//   updateAnnouncement,
//   deleteAnnouncement,
// } from "../../api/dashboardsApi";
// import Modal from "./components/Modal";

// const AnnouncementsPage = () => {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [formData, setFormData] = useState({ name: "", type: "", description: "" });

//   useEffect(() => {
//     fetchAnnouncements();
//   }, []);

//   const fetchAnnouncements = async () => {
//     setLoading(true);
//     try {
//       const data = await getAnnouncements();
//       setAnnouncements(data);
//     } catch (err) {
//       console.error("Error fetching announcements:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleOpenModal = (announcement = null) => {
//     if (announcement) {
//       setEditing(announcement);
//       setFormData({
//         name: announcement.name,
//         type: announcement.type,
//         description: announcement.description,
//       });
//     } else {
//       setEditing(null);
//       setFormData({ name: "", type: "", description: "" });
//     }
//     setIsModalOpen(true);
//   };

//   const handleSave = async () => {
//     try {
//       if (editing) {
//         await updateAnnouncement(editing.id, formData);
//       } else {
//         await createAnnouncement(formData);
//       }
//       await fetchAnnouncements();
//       setIsModalOpen(false);
//     } catch (err) {
//       console.error("Error saving announcement:", err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this announcement?")) return;
//     try {
//       await deleteAnnouncement(id);
//       await fetchAnnouncements();
//     } catch (err) {
//       console.error("Error deleting announcement:", err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">📢 Announcements</h1>
//         <button
//           onClick={() => handleOpenModal()}
//           className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition"
//         >
//           ➕ Add Announcement
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-center text-gray-500 mt-10">Loading...</p>
//       ) : announcements.length === 0 ? (
//         <p className="text-center text-gray-500">No announcements found.</p>
//       ) : (
//         <div className="overflow-x-auto">
//           <table className="min-w-full border border-gray-300 rounded-lg">
//             <thead className="bg-gradient-to-r from-orange-300 to-orange-400 text-gray-800">
//               <tr>
//                 <th className="p-2 border">ID</th>
//                 <th className="p-2 border">Name</th>
//                 <th className="p-2 border">Type</th>
//                 <th className="p-2 border">Description</th>
//                 <th className="p-2 border">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {announcements.map((a) => (
//                 <tr key={a.id} className="hover:bg-gray-50">
//                   <td className="p-2 border text-center">{a.id}</td>
//                   <td className="p-2 border">{a.name}</td>
//                   <td className="p-2 border">{a.type}</td>
//                   <td className="p-2 border">{a.description}</td>
//                   <td className="flex p-2 border text-center space-x-2">
//                     <button
//                       onClick={() => handleOpenModal(a)}
//                       className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1  rounded"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(a.id)}
//                       className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal */}
//       {isModalOpen && (
//         <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
//           <div className="p-4">
//             <h2 className="text-xl font-semibold mb-4">
//               {editing ? "Edit Announcement" : "Add Announcement"}
//             </h2>
//             <input
//               type="text"
//               placeholder="Name"
//               className="border w-full p-2 mb-3 rounded"
//               value={formData.name}
//               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//             />
//             <input
//               type="text"
//               placeholder="Type"
//               className="border w-full p-2 mb-3 rounded"
//               value={formData.type}
//               onChange={(e) => setFormData({ ...formData, type: e.target.value })}
//             />
//             <textarea
//               placeholder="Description"
//               className="border w-full p-2 mb-3 rounded"
//               rows="3"
//               value={formData.description}
//               onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//             />
//             <div className="flex justify-end gap-3">
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
//               >
//                 {editing ? "Update" : "Save"}
//               </button>
//             </div>
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default AnnouncementsPage;

import React, { useEffect, useState } from "react";
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "../../api/dashboardsApi";
import Modal from "./components/Modal";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ name: "", type: "", description: "" });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (announcement = null) => {
    if (announcement) {
      setEditing(announcement);
      setFormData({
        name: announcement.name,
        type: announcement.type,
        description: announcement.description,
      });
    } else {
      setEditing(null);
      setFormData({ name: "", type: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editing) {
        await updateAnnouncement(editing.id, formData);
      } else {
        await createAnnouncement(formData);
      }
      await fetchAnnouncements();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving announcement:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?")) return;
    setSaving(true);
    try {
      await deleteAnnouncement(id);
      await fetchAnnouncements();
    } catch (err) {
      console.error("Error deleting announcement:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 relative min-h-screen">
      {/* Spinner Overlay (when saving or loading) */}
      {(loading || saving) && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
          <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">📢 Announcements</h1>
        <button
          onClick={() => handleOpenModal()}
          disabled={saving}
          className={`bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition ${
            saving && "opacity-50 cursor-not-allowed"
          }`}
        >
          ➕ Add Announcement
        </button>
      </div>

      {!loading && announcements.length === 0 && (
        <p className="text-center text-gray-500">No announcements found.</p>
      )}

      {!loading && announcements.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gradient-to-r from-orange-300 to-orange-400 text-gray-800">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Type</th>
                <th className="p-2 border">Description</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="p-2 border text-center">{a.id}</td>
                  <td className="p-2 border">{a.name}</td>
                  <td className="p-2 border">{a.type}</td>
                  <td className="p-2 border">{a.description}</td>
                  <td className="flex p-2 border text-center space-x-2">
                    <button
                      onClick={() => handleOpenModal(a)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      disabled={saving}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      disabled={saving}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">
              {editing ? "Edit Announcement" : "Add Announcement"}
            </h2>
            <input
              type="text"
              placeholder="Name"
              className="border w-full p-2 mb-3 rounded"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Type"
              className="border w-full p-2 mb-3 rounded"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            />
            <textarea
              placeholder="Description"
              className="border w-full p-2 mb-3 rounded"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition ${
                  saving && "opacity-50 cursor-not-allowed"
                }`}
              >
                {saving ? "Saving..." : editing ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AnnouncementsPage;

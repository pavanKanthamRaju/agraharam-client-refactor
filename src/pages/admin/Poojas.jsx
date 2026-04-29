// import React, { useEffect, useState } from "react";
// import { getPoojas,createPooja,updatePooja } from "../../api/dashboardsApi";
// import CreatePoojaForm from "./components/CreatePoojaForm";
// import PoojaItemsForm from "./components/poojaItemsForm";
// import Modal from "./components/Modal";


// const Poojas = () => {
//   const [poojas, setPoojas] = useState([]);
//   const [showDialog, setShowDialog] = useState(false);
//   const [showPoojaItemDialog, setpoojaItemsDialog] = useState(false);
//   const [selectedPooja, setSelectedPooja] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   const closeModal = () => {

//     setIsModalOpen(false);
//        setSelectedPooja(null);
//   };
//   useEffect(() => {
//     const getPoojasData = async () => {
//       const poojasData = await getPoojas();
//       setPoojas(poojasData);
//     };
//     getPoojasData();
//   }, []);

//   const handleCreate = () => {
//     setSelectedPooja(null);
//     setShowDialog(true);
//     setIsModalOpen(true);
//   };

//   const handleEdit = (pooja) => {
//     setSelectedPooja(pooja);
//     setShowDialog(true);
//   };
//   const handlePoojaItems = (pooja)=>{
//     setSelectedPooja(pooja)
//     setIsModalOpen(true);
//     setpoojaItemsDialog(true);
//   }

//   const handleClose = () => {
//     setShowDialog(false);
//     setSelectedPooja(null);
//     setpoojaItemsDialog(false);
//   };

//   const handleSave = async (poojaData) => {
//     try {
//         let response;
//         if (selectedPooja) {
//           // Editing existing pooja
//           response = await updatePooja(selectedPooja.id, poojaData);
//           setPoojas((prev) =>
//             prev.map((p) => (p.id === response.id ? response : p))
//           );
//         } else {
//           // Creating new pooja
//           response = await createPooja(poojaData);
//           setPoojas((prev) => [...prev, response]);
//         }
//         handleClose();
//       } catch (err) {
//         console.error("Error saving pooja:", err);
//       }
//   };

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
//   <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
//     Pooja Management
//   </h2>

//   <button
//     onClick={handleCreate}
//     className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium shadow-md transition hover:bg-blue-700 active:scale-95 text-center"
//   >
//     + Create Pooja
//   </button>
// </div>


//       {/* Cards Section */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {poojas.map((pooja) => (
//           <div
//             key={pooja.id}
//             className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100"
//           >
//             {/* Card Header */}
//             <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-orange-300 to-orange-400 border-b">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 {pooja.name}
//               </h3>
//               <span className="text-blue-700 font-semibold">
//                 ₹{pooja.base_price}
//               </span>
//             </div>

//             {/* Card Body */}
//             <div className="p-4">
//               <p className="text-gray-600 text-sm leading-relaxed">
//                 {pooja.description || "No description provided."}
//               </p>
//             </div>

//             {/* Card Footer */}
//             <div className="flex justify-between flex-col sm:flex-row items-center gap-2  px-4 py-3 border-t bg-gray-700">
//               <button
//                 onClick={() => handleEdit(pooja)}
//                 className="w-full sm:w-auto overflow-hidden  px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-600 active:scale-95 transition"
//               >
//                 Edit
//               </button>
//               <button
//     className="w-full sm:w-auto overflow-hidden px-4 py-2 rounded-md bg-orange-500 text-white text-sm font-medium shadow-sm hover:bg-orange-600 active:scale-95 transition"
//     onClick={() => handlePoojaItems(pooja)}

//   >
//     Update Pooja Items
//   </button>
//               <button
//                 onClick={() => console.log('Delete', pooja.id)}
//                 className="w-full sm:w-auto overflow-hidden px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium shadow-sm hover:bg-red-600 active:scale-95 transition"
//               >
//                 Delete
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Dialog Modal */}
//       {showDialog && (
//         <CreatePoojaForm
//           pooja={selectedPooja}
//           onClose={handleClose}
//           onSave={handleSave}
//         />
//       )}
//        {showPoojaItemDialog && (
//       <Modal
//       isOpen={isModalOpen}
//       onClose={closeModal}
//       title={`Update Pooja Items - ${selectedPooja? selectedPooja.name : ""}`}
//     >
//       <PoojaItemsForm pooja={selectedPooja} onClose={closeModal} />
//     </Modal>

//       )}
//     </div>
//   );
// };

// export default Poojas;
import React, { useEffect, useState } from "react";
import { getPoojas, createPooja, updatePooja } from "../../api/dashboardsApi";
import CreatePoojaForm from "./components/CreatePoojaForm";
import PoojaItemsForm from "./components/poojaItemsForm";
import Modal from "./components/Modal";

const Poojas = () => {
  const [poojas, setPoojas] = useState([]);
  const [search, setSearch] = useState("");
  const [filterdPoojas, setFilterdPoojas] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showPoojaItemDialog, setpoojaItemsDialog] = useState(false);
  const [selectedPooja, setSelectedPooja] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false); // 🔥 Spinner state

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPooja(null);
  };

  useEffect(() => {
    const getPoojasData = async () => {
      try {
        setLoading(true);
        const poojasData = await getPoojas();
        setPoojas(poojasData);
        setFilterdPoojas(poojasData);
      } catch (err) {
        console.error("Error fetching poojas:", err);
      } finally {
        setLoading(false);
      }
    };
    getPoojasData();
  }, []);
  useEffect(() => {

    let q = search.toLowerCase();
    const filterdData = poojas.filter((pooja) => {
      return pooja.name?.toLowerCase().includes(q);
    })
    setFilterdPoojas(filterdData);

  }, [search, poojas])

  const handleCreate = () => {
    setSelectedPooja(null);
    setShowDialog(true);
    setIsModalOpen(true);
  };

  const handleEdit = (pooja) => {
    setSelectedPooja(pooja);
    setShowDialog(true);
  };

  const handlePoojaItems = (pooja) => {
    setSelectedPooja(pooja);
    setIsModalOpen(true);
    setpoojaItemsDialog(true);
  };

  const handleClose = () => {
    setShowDialog(false);
    setSelectedPooja(null);
    setpoojaItemsDialog(false);
  };

  const handleSave = async (poojaData) => {
    try {
      setLoading(true);
      let response;
      if (selectedPooja) {
        response = await updatePooja(selectedPooja.id, poojaData);
        setPoojas((prev) =>
          prev.map((p) => (p.id === response.id ? response : p))
        );
      } else {
        response = await createPooja(poojaData);
        setPoojas((prev) => [...prev, response]);
      }
      handleClose();
    } catch (err) {
      console.error("Error saving pooja:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      {/* 🔥 Spinner Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-50">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Header Section */}
      {/* 🔍 SEARCH + SORT BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-3">
        <input
          type="text"
          placeholder="Search by Pooja name "
          className="w-full sm:w-1/3 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />


      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center sm:text-left">
          Pooja Management
        </h2>

        <button
          onClick={handleCreate}
          className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium shadow-md transition hover:bg-blue-700 active:scale-95 text-center"
        >
          + Create Pooja
        </button>
      </div>

      {/* Cards Section */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filterdPoojas.map((pooja) => (
          <div
            key={pooja.id}
            className="flex flex-col h-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-100"
          >
            <div className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-orange-300 to-orange-400 border-b">
              <h3 className="text-lg font-semibold text-gray-800">
                {pooja.name}
              </h3>
              <span className="text-blue-700 font-semibold">
                ₹{pooja.base_price}
              </span>
            </div>

            <div className="p-4 flex-grow">
              <p className="text-gray-600 text-sm leading-relaxed">
                {pooja.description || "No description provided."}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 py-3 border-t bg-gray-700">
              <button
                onClick={() => handleEdit(pooja)}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-blue-500 text-white text-sm font-medium shadow-sm hover:bg-blue-600 active:scale-95 transition"
              >
                Edit
              </button>
              <button
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-orange-500 text-white text-sm font-medium shadow-sm hover:bg-orange-600 active:scale-95 transition text-center"
                onClick={() => handlePoojaItems(pooja)}
              >
                Update items
              </button>
              <button
                onClick={() => console.log("Delete", pooja.id)}
                className="w-full sm:w-auto px-4 py-2 rounded-md bg-red-500 text-white text-sm font-medium shadow-sm hover:bg-red-600 active:scale-95 transition"
              >
                Delete
              </button>
            </div>
          </div>


        ))}
      </div>

      {/* Dialog Modal */}
      {showDialog && (
        <CreatePoojaForm
          pooja={selectedPooja}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
      {showPoojaItemDialog && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`Update Pooja Items - ${selectedPooja ? selectedPooja.name : ""
            }`}
        >
          <PoojaItemsForm pooja={selectedPooja} onClose={closeModal} />
        </Modal>
      )}
    </div>
  );
};

export default Poojas;


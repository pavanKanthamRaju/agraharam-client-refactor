import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPoojaById, getPoojaItemsByid, getPoojaNivedyamsByPoojaId } from "../api/dashboardsApi";
import { useAppContext } from "../context/appContext"
import PoojaItemsModal from "../components/PoojaItemsModal";
import PoojaNivedyamsModal from "../components/PoojaNivedyamsModal";

const PoojaDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pooja, setPooja] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [poojaItems, setPoojaItems] = useState([]);
  const [selectedNivedyams, setSelectedNivedyams] = useState([]);
  const [poojaNivedyams, setPoojaNivedyams] = useState([]);

  const { orderData, setOrderData, setPoojsSelectedItems } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNivedyamModalOpen, setIsNivedyamModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const poojaData = await getPoojaById(Number(id));
        setPooja(poojaData);

        // Once we have pooja ID, fetch its items
        const itemsData = await getPoojaItemsByid(Number(id));
        setPoojaItems(itemsData);

        // Fetch Pooja Nivedyams
        const nivedyamsData = await getPoojaNivedyamsByPoojaId(Number(id));
        setPoojaNivedyams(nivedyamsData || []);
      } catch (error) {
        console.error("Error fetching pooja details, items or nivedyams:", error);
      }
    };

    fetchData();
  }, [id]);
  useEffect(() => {
    if (orderData) {
      localStorage.setItem("orderData", JSON.stringify(orderData));
    }
  }, [orderData]);

  const poojaPrice = pooja?.base_price;

  // Use a fallback value (like 0) if basePrice is null or undefined
  const priceString = String(poojaPrice || 0);

  const basePrice = parseFloat(priceString.replace(/[^0-9.]/g, ""));

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSelection = (items) => {
    setSelectedItems(items);
    setIsModalOpen(false);
  };



  const getItemTotal = () => {
    return selectedItems.reduce((total, item) => {
      const priceAsNumber = parseFloat(item.price);
      if (!isNaN(priceAsNumber)) {
        return total + priceAsNumber;
      }
      return total;
    }, 0);
  };

  const getNivedyamTotal = () => {
    return selectedNivedyams.reduce((total, item) => {
      const priceAsNumber = parseFloat(item.price);
      if (!isNaN(priceAsNumber)) {
        return total + priceAsNumber;
      }
      return total;
    }, 0);
  };


  const handleCheckout = () => {
    const data = {
      poojaId: pooja.id,
      poojaName: pooja.name,
      description: pooja.description,
      price: pooja.base_price,
      itemCost: getItemTotal(),
      nivedyamCost: getNivedyamTotal(),
      totalPrice,
      items: selectedItems,
      nivedyams: selectedNivedyams,
    }
    setOrderData(data);
    setPoojsSelectedItems(selectedItems);
    navigate("/order-review");
  };

  const itemsPrice = selectedItems.reduce((sum, item) => sum + Number(item.price), 0);
  const nivedyamsPrice = selectedNivedyams.reduce((sum, item) => sum + Number(item.price), 0);
  const totalPrice = basePrice + itemsPrice + nivedyamsPrice;

  if (!pooja) {
    return (
      <div className="text-center py-10 text-orange-600 font-medium">
        Loading Pooja Details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffaf0] py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl overflow-hidden flex flex-col md:flex-row">

        {/* Image */}
        <div className="md:w-1/2 h-[500px] bg-gray-50">
          <img
            src={pooja.image_url}
            alt={pooja.name}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-3xl font-extrabold text-orange-800 mb-4">
              {pooja.name}
            </h2>
            <p className="text-gray-700 text-base leading-relaxed mb-4">
              {pooja.description}
            </p>

            {/* Items Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-orange-700">Add Pooja Items (Optional):</h3>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                {selectedItems.length > 0 ? (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Selected Items:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItems.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-orange-800 border border-orange-200 shadow-sm">
                          {item.name}
                        </span>
                      ))}
                      {selectedItems.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          + more
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-3">No extra items selected.</p>
                )}

                <button
                  onClick={handleOpenModal}
                  className="w-full sm:w-auto bg-white border border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 font-medium py-2 px-4 rounded-md transition shadow-sm flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {selectedItems.length > 0 ? "Edit Pooja Items" : "Add Pooja Items"}
                </button>
              </div>
            </div>

            <PoojaItemsModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onConfirm={handleConfirmSelection}
              items={poojaItems}
              initialSelectedItems={selectedItems}
            />

            {/* Nivedyam Selection */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-orange-700">Add Pooja Nivedyams (Optional):</h3>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                {selectedNivedyams.length > 0 ? (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Selected Nivedyams:</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedNivedyams.map((item, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-orange-800 border border-orange-200 shadow-sm">
                          {item.name}
                        </span>
                      ))}
                      {selectedNivedyams.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          + more
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-3">No nivedyam selected.</p>
                )}

                <button
                  onClick={() => setIsNivedyamModalOpen(true)}
                  className="w-full sm:w-auto bg-white border border-orange-300 text-orange-700 hover:bg-orange-50 hover:text-orange-800 font-medium py-2 px-4 rounded-md transition shadow-sm flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  {selectedNivedyams.length > 0 ? "Edit Nivedyams" : "Add Nivedyams"}
                </button>
              </div>
            </div>

            <PoojaNivedyamsModal
              isOpen={isNivedyamModalOpen}
              onClose={() => setIsNivedyamModalOpen(false)}
              onConfirm={(items) => {
                setSelectedNivedyams(items);
                setIsNivedyamModalOpen(false);
              }}
              items={poojaNivedyams}
              initialSelectedItems={selectedNivedyams}
            />
          </div>

          {/* Total */}
          <div className="mt-4 text-right text-xl font-semibold text-orange-800">
            Total Price: ₹{totalPrice.toLocaleString()}
          </div>

          {/* Checkout */}
          <div className="mt-6">
            <button
              onClick={handleCheckout}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium px-6 py-3 rounded-md w-full transition"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoojaDetailsPage;

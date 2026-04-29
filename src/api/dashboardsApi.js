import apiClient from "../utils/appClient";
let poojas;
const getPoojaById = async (id) => {
    return poojas.find((pooja) => pooja.id === Number(id));
};
 const getPoojas = async()=>{
    try{
        const response = await apiClient.get("/poojas");
        poojas = response.data
        return response.data

    }catch(error){
        const message =
        error.response?.data?.message || error.message || "Something went wrong...";
      throw new Error(message);
    }
    
}
const createPooja = async (poojaData) => {
    try {
      const response = await apiClient.post("/poojas", poojaData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while creating the pooja.";
      throw new Error(message);
    }
  };
  
  // Update Pooja (JSON payload)
  const updatePooja = async (id, poojaData) => {
    if (!id) throw new Error("Pooja ID is required for update");
  
    try {
      const response = await apiClient.put(`/poojas/${id}`, poojaData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while updating the pooja.";
      throw new Error(message);
    }
  };
  const getAllOrders = async (id, poojaData) => {
  
  
    try {
      const response = await apiClient.get("/orders/getallOrders");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while updating the pooja.";
      throw new Error(message);
    }
  };

  const createItem = async (itemData) => {
    try {
      const response = await apiClient.post("/items", itemData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while creating the pooja.";
      throw new Error(message);
    }
  };
  const updateItem = async (itemId, itemData) => {
    try {
      const response = await apiClient.put(`/items/${itemId}`, itemData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while updating the item.";
      throw new Error(message);
    }
  };
  
  const getAllItems = async (id, poojaData) => {
    try {
      const response = await apiClient.get("/items");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while updating the pooja.";
      throw new Error(message);
    }
  };
  const deleteItem = async (itemId) => {
    try {
      const response = await apiClient.delete(`/items/${itemId}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while deleting the item.";
      throw new Error(message);
    }
  };

  const getPoojaItemsByid = async (poojaId) => {
    try {
      const response = await apiClient.get(`/poojaItems/${poojaId}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while updating the pooja.";
      throw new Error(message);
    }
  };
  const addPoojaItem = async (itemData) => {
    try {
      const response = await apiClient.post("/poojaItems", itemData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while creating the pooja.";
      throw new Error(message);
    }
  };
  const deletePoojaItem = async (itemId) => {
    try {
      const response = await apiClient.delete(`/poojaItems/${itemId}`);
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong while deleting the item.";
      throw new Error(message);
    }
  };
   const getAnnouncements = async () => {
    const res = await apiClient.get("/announcements");
    return res.data.data;
  };
  
   const createAnnouncement = async (data) => {
    const res = await apiClient.post("/announcements", data);
    return res.data.data;
  };
  
   const updateAnnouncement = async (id, data) => {
    const res = await apiClient.put(`/announcements/${id}`, data);
    return res.data.data;
  };
  
   const deleteAnnouncement = async (id) => {
    const res = await apiClient.delete(`/announcements/${id}`);
    return res.data;
  };
  
 
  
export { poojas, getPoojaById, getPoojas,createPooja,updatePooja,getAllOrders, createItem,updateItem,deleteItem,getAllItems,getPoojaItemsByid, addPoojaItem, deletePoojaItem,getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement}

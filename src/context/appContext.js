import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();
export const AppContextProvider = ({ children }) => {

    const [poojsSelectedItems, setPoojsSelectedItems] = useState([]);
    const [address, setAddress] = useState("");
    const [orderData, setOrderData] = useState("");

    return (
        <AppContext.Provider value={{
            orderData, setOrderData,
            poojsSelectedItems, setPoojsSelectedItems,
            address, setAddress
        }}>
            {children}
        </AppContext.Provider>
    )
}
export const useAppContext = () => useContext(AppContext);


import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getOrders } from "../../utils/api";
import useCustomerId from "./customerId";
import { useState } from "react";

const useCurrentUserOrders =()=>{

    const [orders, setOrders] = useState(null)
    const customerId = useCustomerId()
    useFocusEffect(
        useCallback(() => {
      let isActive = true;

      async function fetchOrders() {
        // Call API to retrieve all orders
        try {
            const allOrders = await getOrders();
            // Filter orders to include only those for the current customer
            const currentUserOrders = allOrders?.data?.filter(o => o.customerID == customerId);
            
            // Update state with filtered orders and set loading flag to false
            if (isActive) {
                setOrders(currentUserOrders);
            
            }
        } catch (e) {
            console.log('got asn errror while fetching order', e);
           
        } 
      
    }
    
    // If customer ID is available, fetch orders
    if (customerId) {
        fetchOrders();
    }
    
      // Set isActive flag to false when component loses focus
      return () => {
          isActive = false;
        };
    }, [customerId]),
    );

    return orders
}

export default useCurrentUserOrders;



import { useState,useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getCustomers } from '../../utils/api';

const useCurrentCustomer = (customerId,setIsLoading, email) => {
  const [currentCustomer, setCurrentCustomer] = useState(null);
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      async function fetchCustomers() {
        try {
          const customers = await getCustomers();
          const filtered = customers?.data?.find(
            customer => customer?.serialNo == customerId
          );

          if (isActive) {
            setCurrentCustomer(filtered);
          }
        } catch (error) {
          console.log(error);
         
        } finally {
          setIsLoading && setIsLoading(false);
        }
      }

      if (customerId) {
        fetchCustomers();
      }

      return () => {
        isActive = false;
      };
    }, [customerId,email])
  );


  return currentCustomer;
};

export default useCurrentCustomer;

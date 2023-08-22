
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getCustomers } from '../../utils/api';
import { useGetCustomersQuery } from '../../store/redux/reduxToolkit/apiSlice';

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
            // setIsLoading(false);
          }
        } catch (error) {
          console.log(error);
          // handle the error here, e.g. set an error message
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

  // Rest of the code...

  return currentCustomer;
};

export default useCurrentCustomer;

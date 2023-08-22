import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useCustomerId = () => {
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomerId = async () => {
      try {
        const storedCustomerId = await AsyncStorage.getItem('customerId');
        if (storedCustomerId !== null) {
          setCustomerId(storedCustomerId);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchCustomerId();
  }, []);

  return customerId;
};

// -----------------------

export default useCustomerId;

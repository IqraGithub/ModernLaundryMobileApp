import { useState, useEffect } from 'react';
import { getProducts } from '../../utils/api';

export function useProducts() {
  const [products, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await getProducts();
        setAllProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {  products, isLoading };
}
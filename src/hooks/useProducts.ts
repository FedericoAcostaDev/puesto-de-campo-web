import { useState, useEffect } from 'react';
import { Product } from '../types';
import { fetchProductsFromSheet } from '../services/productService';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProductsFromSheet()
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudieron cargar los cortes de carne.");
        setLoading(false);
      });
  }, []);

  return { products, loading, error };
};
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { fetchProductsFromSheet } from '../services/productService';
import { Product } from '../types';

export const useProducts = () => {
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProductsFromSheet,
    
    // 1. Evita que la pantalla "salte" a blanco al recargar o filtrar.
    // Mantiene los datos anteriores en pantalla hasta que los nuevos llegan.
    placeholderData: keepPreviousData,

    // 2. Transformación y limpieza de datos (Opcional pero recomendado)
    select: (data: Product[]) => {
      return data.map(product => ({
        ...product,
        // Aseguramos que el nombre no tenga espacios extras y el precio sea número
        name: product.name?.trim() || "Producto sin nombre",
        price: Number(product.price) || 0,
      }));
    },

    // 3. Optimización de rendimiento para evitar re-renders innecesarios
    notifyOnChangeProps: ['data', 'isLoading', 'isError', 'isFetching'],
  });

  return { 
    // Usamos ?? para asegurar que siempre devolvemos un array
    products: data ?? [], 
    loading: isLoading, 
    // Útil para mostrar un pequeño spinner de "Actualizando..." en una esquina
    isRefreshing: isFetching && !isLoading, 
    error: isError ? "No se pudieron cargar los productos." : null 
  };
};
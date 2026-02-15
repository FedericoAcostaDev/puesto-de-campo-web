import { fetchProductsFromSheet } from '@/services/productService';

// Ya no definimos el array acá, lo traemos de la nube
export const getProducts = async () => {
  return await fetchProductsFromSheet();
};

// Las categorías pueden seguir siendo estáticas o podrías extraerlas de los productos
export const categories = ['Todos', 'Vacuno', 'Embutidos', 'Cerdo', 'Achuras'];